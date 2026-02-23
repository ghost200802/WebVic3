import { Technology } from '../../models'
import { TECHNOLOGIES } from '../../models'

export interface ITechnologyTree {
  getTechnology(id: string): Technology | undefined
  getAllTechnologies(): Technology[]
  getPrerequisites(technologyId: string): string[]
  getDependentTechnologies(technologyId: string): string[]
  getResearchCost(technologyId: string): number
  canResearch(technologyId: string, unlockedTechnologies: Set<string>): boolean
}

export class TechnologyTree implements ITechnologyTree {
  private technologies: Map<string, Technology>

  constructor() {
    this.technologies = new Map()
    this.initializeTechnologies()
  }

  private initializeTechnologies(): void {
    Object.values(TECHNOLOGIES).forEach(tech => {
      this.technologies.set(tech.id, tech)
    })
  }

  getTechnology(id: string): Technology | undefined {
    return this.technologies.get(id)
  }

  getAllTechnologies(): Technology[] {
    return Array.from(this.technologies.values())
  }

  getPrerequisites(technologyId: string): string[] {
    const tech = this.technologies.get(technologyId)
    return tech?.prerequisites || []
  }

  getDependentTechnologies(technologyId: string): string[] {
    return Array.from(this.technologies.values())
      .filter(tech => tech.prerequisites.includes(technologyId))
      .map(tech => tech.id)
  }

  getResearchCost(technologyId: string): number {
    const tech = this.technologies.get(technologyId)
    return tech?.researchCost || 0
  }

  canResearch(technologyId: string, unlockedTechnologies: Set<string>): boolean {
    const tech = this.technologies.get(technologyId)
    if (!tech) return false

    return tech.prerequisites.every(prereq => unlockedTechnologies.has(prereq))
  }
}
