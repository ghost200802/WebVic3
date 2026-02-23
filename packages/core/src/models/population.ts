import { AgeGroup, EducationLevel, SocialClass, EmploymentStatus } from './baseTypes'

export interface PopulationGroup {
  id: string
  size: number
  ageGroup: AgeGroup
  education: EducationLevel
  socialClass: SocialClass
  employment: EmploymentStatus
  workplace?: string
  profession?: string
  wage: number
  wealth: number
  livingStandard: number
  needs: {
    survival: number
    basic: number
    improved: number
    luxury: number
  }
}

export interface Population {
  id: string
  tileId: string
  totalPopulation: number
  groups: PopulationGroup[]
  ageDistribution: {
    children: number
    adults: number
    elders: number
  }
  educationDistribution: Record<EducationLevel, number>
  classDistribution: Record<SocialClass, number>
  employment: {
    total: number
    employed: number
    unemployed: number
    retired: number
  }
  averageWage: number
  averageLivingStandard: number
  birthRate: number
  deathRate: number
  netMigration: number
}

export interface Profession {
  id: string
  name: string
  buildingType: string
  baseWage: number
  requiredEducation: EducationLevel
  skillModifier: number
}
