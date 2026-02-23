import { Population, PopulationGroup, AgeGroup, EducationLevel, SocialClass, EmploymentStatus } from '../../models'

export interface IPopulationManager {
  createPopulation(tileId: string, initialPopulation: number): Population
  addPopulation(populationId: string, amount: number): void
  removePopulation(populationId: string, amount: number): void
  getPopulation(id: string): Population | undefined
  employPopulation(populationId: string, buildingId: string, count: number): void
  unemployPopulation(populationId: string, count: number): void
  updateNeeds(populationId: string): void
  calculateGrowth(populationId: string): number
}

export class PopulationManager implements IPopulationManager {
  private populations: Map<string, Population>
  private nextId: number

  constructor() {
    this.populations = new Map()
    this.nextId = 1
  }

  createPopulation(tileId: string, initialPopulation: number): Population {
    const groups = this.distributePopulation(initialPopulation)
    const distribution = this.calculateDistribution(groups)

    const population: Population = {
      id: `pop_${this.nextId++}`,
      tileId,
      totalPopulation: initialPopulation,
      groups,
      ageDistribution: {
        children: distribution.children,
        adults: distribution.adults,
        elders: distribution.elders
      },
      educationDistribution: this.calculateEducationDistribution(groups),
      classDistribution: this.calculateClassDistribution(groups),
      employment: {
        total: initialPopulation,
        employed: 0,
        unemployed: initialPopulation,
        retired: 0
      },
      averageWage: 0,
      averageLivingStandard: 0,
      birthRate: 0.03,
      deathRate: 0.02,
      netMigration: 0
    }

    this.populations.set(population.id, population)
    return population
  }

  addPopulation(populationId: string, amount: number): void {
    const population = this.populations.get(populationId)
    if (!population) return

    const newGroups = this.distributePopulation(amount)
    newGroups.forEach(group => {
      const existingGroup = population.groups.find(g => 
        g.ageGroup === group.ageGroup && 
        g.education === group.education &&
        g.socialClass === group.socialClass
      )
      if (existingGroup) {
        existingGroup.size += group.size
      } else {
        population.groups.push(group)
      }
    })

    population.totalPopulation += amount
    this.updatePopulationStatistics(population)
  }

  removePopulation(populationId: string, amount: number): void {
    const population = this.populations.get(populationId)
    if (!population) return

    if (amount >= population.totalPopulation) {
      this.populations.delete(populationId)
      return
    }

    let remaining = amount
    for (const group of population.groups) {
      if (remaining <= 0) break
      const removeAmount = Math.min(group.size, remaining)
      group.size -= removeAmount
      remaining -= removeAmount
    }

    population.totalPopulation -= amount
    this.updatePopulationStatistics(population)
  }

  getPopulation(id: string): Population | undefined {
    return this.populations.get(id)
  }

  employPopulation(populationId: string, buildingId: string, count: number): void {
    const population = this.populations.get(populationId)
    if (!population) return

    let remaining = count
    for (const group of population.groups) {
      if (remaining <= 0) break
      if (group.employment === EmploymentStatus.UNEMPLOYED) {
        const employAmount = Math.min(group.size, remaining)
        group.employment = EmploymentStatus.EMPLOYED
        group.workplace = buildingId
        group.size -= employAmount
        remaining -= employAmount
      }
    }

    population.employment.employed += count
    population.employment.unemployed -= count
  }

  unemployPopulation(populationId: string, count: number): void {
    const population = this.populations.get(populationId)
    if (!population) return

    let remaining = count
    for (const group of population.groups) {
      if (remaining <= 0) break
      if (group.employment === EmploymentStatus.EMPLOYED) {
        const unemployAmount = Math.min(group.size, remaining)
        group.employment = EmploymentStatus.UNEMPLOYED
        group.workplace = undefined
        remaining -= unemployAmount
      }
    }

    population.employment.employed -= count
    population.employment.unemployed += count
  }

  updateNeeds(populationId: string): void {
    const population = this.populations.get(populationId)
    if (!population) return

    for (const group of population.groups) {
      const wage = group.wage || 0
      const needs = this.calculateNeeds(wage)
      group.needs = needs
    }

    const totalSatisfaction = population.groups.reduce((sum, g) => {
      const totalNeeds = g.needs.survival + g.needs.basic + g.needs.improved + g.needs.luxury
      const fulfilledNeeds = Math.min(g.wage, totalNeeds)
      return sum + (fulfilledNeeds / totalNeeds)
    }, 0)

    population.averageLivingStandard = totalSatisfaction / population.groups.length
  }

  calculateGrowth(populationId: string): number {
    const population = this.populations.get(populationId)
    if (!population) return 0

    const births = population.totalPopulation * population.birthRate
    const deaths = population.totalPopulation * population.deathRate
    const migration = population.netMigration

    const naturalGrowth = births - deaths
    return Math.floor(naturalGrowth + migration)
  }

  private distributePopulation(amount: number): PopulationGroup[] {
    const groups: PopulationGroup[] = []
    const ageDistribution = [0.2, 0.6, 0.2]
    const educationDistribution = [0.3, 0.4, 0.2, 0.08, 0.02]
    const classDistribution = [0.1, 0.3, 0.5, 0.1]

    let remaining = amount
    for (const age of [AgeGroup.CHILD, AgeGroup.ADULT, AgeGroup.ELDER]) {
      for (const edu of [EducationLevel.ILLITERATE, EducationLevel.BASIC, EducationLevel.PRIMARY, 
                        EducationLevel.SECONDARY, EducationLevel.UNIVERSITY]) {
        for (const socialClass of [SocialClass.ELITE, SocialClass.MIDDLE, 
                                SocialClass.WORKER, SocialClass.POOR]) {
          if (remaining <= 0) break
          
          const ageRatio = ageDistribution[[AgeGroup.CHILD, AgeGroup.ADULT, AgeGroup.ELDER].indexOf(age)]
          const eduRatio = educationDistribution[[EducationLevel.ILLITERATE, EducationLevel.BASIC, 
                                                        EducationLevel.PRIMARY, EducationLevel.SECONDARY, EducationLevel.UNIVERSITY].indexOf(edu)]
          const classRatio = classDistribution[[SocialClass.ELITE, SocialClass.MIDDLE, 
                                                              SocialClass.WORKER, SocialClass.POOR].indexOf(socialClass)]
          
          const groupSize = Math.floor(amount * ageRatio * eduRatio * classRatio)
          if (groupSize > 0) {
            groups.push({
              id: `group_${Date.now()}_${Math.random()}`,
              size: groupSize,
              ageGroup: age,
              education: edu,
              socialClass,
              employment: EmploymentStatus.UNEMPLOYED,
              wage: this.calculateBaseWage(edu, socialClass),
              wealth: 0,
              livingStandard: 0,
              needs: {
                survival: 0,
                basic: 0,
                improved: 0,
                luxury: 0
              }
            })
          }
          
          remaining -= groupSize
        }
      }
    }

    return groups
  }

  private calculateDistribution(groups: PopulationGroup[]) {
    return {
      children: groups.filter(g => g.ageGroup === AgeGroup.CHILD).reduce((sum, g) => sum + g.size, 0),
      adults: groups.filter(g => g.ageGroup === AgeGroup.ADULT).reduce((sum, g) => sum + g.size, 0),
      elders: groups.filter(g => g.ageGroup === AgeGroup.ELDER).reduce((sum, g) => sum + g.size, 0)
    }
  }

  private calculateEducationDistribution(groups: PopulationGroup[]): Record<EducationLevel, number> {
    const distribution = {
      [EducationLevel.ILLITERATE]: 0,
      [EducationLevel.BASIC]: 0,
      [EducationLevel.PRIMARY]: 0,
      [EducationLevel.SECONDARY]: 0,
      [EducationLevel.UNIVERSITY]: 0,
      [EducationLevel.POSTGRADUATE]: 0
    }
    
    for (const group of groups) {
      distribution[group.education] += group.size
    }
    
    return distribution
  }

  private calculateClassDistribution(groups: PopulationGroup[]): Record<SocialClass, number> {
    const distribution = {
      [SocialClass.ELITE]: 0,
      [SocialClass.MIDDLE]: 0,
      [SocialClass.WORKER]: 0,
      [SocialClass.POOR]: 0
    }
    
    for (const group of groups) {
      distribution[group.socialClass] += group.size
    }
    
    return distribution
  }

  private calculateBaseWage(education: EducationLevel, socialClass: SocialClass): number {
    const educationBonus = {
      [EducationLevel.ILLITERATE]: 1.0,
      [EducationLevel.BASIC]: 1.2,
      [EducationLevel.PRIMARY]: 1.5,
      [EducationLevel.SECONDARY]: 1.8,
      [EducationLevel.UNIVERSITY]: 2.5,
      [EducationLevel.POSTGRADUATE]: 3.0
    }
    
    const classMultiplier = {
      [SocialClass.ELITE]: 2.0,
      [SocialClass.MIDDLE]: 1.5,
      [SocialClass.WORKER]: 1.0,
      [SocialClass.POOR]: 0.8
    }
    
    return 10 * educationBonus[education] * classMultiplier[socialClass]
  }

  private calculateNeeds(wage: number) {
    const survival = wage * 0.4
    const basic = wage * 0.3
    const improved = wage * 0.2
    const luxury = wage * 0.1

    return { survival, basic, improved, luxury }
  }

  private updatePopulationStatistics(population: Population): void {
    population.ageDistribution = this.calculateDistribution(population.groups)
    population.educationDistribution = this.calculateEducationDistribution(population.groups)
    population.classDistribution = this.calculateClassDistribution(population.groups)
    
    const totalWage = population.groups.reduce((sum, g) => sum + g.wage * g.size, 0)
    population.averageWage = totalWage / population.totalPopulation
    
    const employmentStats = population.groups.reduce((stats, g) => ({
      total: stats.total + g.size,
      employed: stats.employed + (g.employment === EmploymentStatus.EMPLOYED ? g.size : 0),
      unemployed: stats.unemployed + (g.employment === EmploymentStatus.UNEMPLOYED ? g.size : 0),
      retired: stats.retired + (g.employment === EmploymentStatus.RETIRED ? g.size : 0)
    }), { total: 0, employed: 0, unemployed: 0, retired: 0 })
    
    population.employment = employmentStats
  }
}
