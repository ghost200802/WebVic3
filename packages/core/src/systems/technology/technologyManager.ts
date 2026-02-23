import { Technology, ResearchQueue, GameDate, TECHNOLOGIES } from '../../models'

export interface ITechnologyManager {
  addTechnology(techId: string): void
  hasTechnology(techId: string): boolean
  getAvailableTechnologies(ownedTech: Set<string>): string[]
  enqueueResearch(techId: string): void
  dequeueResearch(): void
  advanceResearch(progress: number): void
  getCurrentResearch(): { tech: string; progress: number; completion: number } | null
  getResearchQueue(): ResearchQueue
}

export class TechnologyManager implements ITechnologyManager {
  private technologies: Set<string>
  private researchQueue: ResearchQueue
  private researchProgress: Map<string, number>

  constructor() {
    this.technologies = new Set()
    this.researchProgress = new Map()
    this.researchQueue = {
      current: null as any,
      queue: [],
      researchSpeed: 1.0
    }
  }

  addTechnology(techId: string): void {
    if (!TECHNOLOGIES[techId]) {
      throw new Error(`Technology not found: ${techId}`)
    }

    this.technologies.add(techId)
    this.researchProgress.delete(techId)
  }

  hasTechnology(techId: string): boolean {
    return this.technologies.has(techId)
  }

  getAvailableTechnologies(ownedTech: Set<string>): string[] {
    const available: string[] = []

    for (const [techId, tech] of Object.entries(TECHNOLOGIES)) {
      if (ownedTech.has(techId)) continue

      const hasPrerequisites = tech.prerequisites.every(prereq => ownedTech.has(prereq))
      if (!hasPrerequisites) continue

      available.push(techId)
    }

    return available
  }

  enqueueResearch(techId: string): void {
    if (this.technologies.has(techId)) {
      throw new Error(`Technology already researched: ${techId}`)
    }

    const tech = TECHNOLOGIES[techId]
    if (!tech) {
      throw new Error(`Technology not found: ${techId}`)
    }

    if (!this.meetsPrerequisites(tech)) {
      throw new Error(`Prerequisites not met for: ${techId}`)
    }

    if (this.researchQueue.queue.includes(techId)) {
      throw new Error(`Technology already in queue: ${techId}`)
    }

    this.researchQueue.queue.push(techId)
  }

  dequeueResearch(): void {
    if (this.researchQueue.queue.length === 0) return

    this.researchQueue.queue.shift()
  }

  advanceResearch(progress: number): void {
    if (!this.researchQueue.current && this.researchQueue.queue.length === 0) return

    if (!this.researchQueue.current) {
      this.startNextResearch()
    }

    if (this.researchQueue.current) {
      const currentTechId = this.researchQueue.current.tech
      const currentProgress = this.researchProgress.get(currentTechId) || 0
      const newProgress = currentProgress + progress * this.researchQueue.researchSpeed

      this.researchProgress.set(currentTechId, newProgress)

      const tech = TECHNOLOGIES[currentTechId]
      if (newProgress >= tech.researchCost) {
        this.completeResearch(currentTechId)
      }
    }
  }

  getCurrentResearch(): { tech: string; progress: number; completion: number } | null {
    if (!this.researchQueue.current) return null

    const currentTechId = this.researchQueue.current.tech
    const progress = this.researchProgress.get(currentTechId) || 0
    const tech = TECHNOLOGIES[currentTechId]
    const completion = Math.min(100, (progress / tech.researchCost) * 100)

    return {
      tech: currentTechId,
      progress,
      completion
    }
  }

  getResearchQueue(): ResearchQueue {
    return { ...this.researchQueue }
  }

  private meetsPrerequisites(tech: Technology): boolean {
    return tech.prerequisites.every(prereq => this.technologies.has(prereq))
  }

  private startNextResearch(): void {
    const nextTechId = this.researchQueue.queue[0]
    if (!nextTechId) return

    const tech = TECHNOLOGIES[nextTechId]
    this.researchQueue.current = {
      tech: nextTechId,
      progress: 0,
      estimatedCompletion: this.calculateEstimatedCompletion(tech)
    }

    this.researchProgress.set(nextTechId, 0)
    this.researchQueue.queue.shift()
  }

  private completeResearch(techId: string): void {
    this.addTechnology(techId)
    this.researchQueue.current = null

    if (this.researchQueue.queue.length > 0) {
      this.startNextResearch()
    }
  }

  private calculateEstimatedCompletion(tech: Technology): GameDate {
    const now = new Date()
    const msPerTick = 1000
    const ticksPerDay = 86400000 / msPerTick
    const totalTicks = tech.researchCost / this.researchQueue.researchSpeed
    const totalDays = Math.ceil(totalTicks / ticksPerDay)

    const completionDate = new Date(now.getTime() + totalDays * 24 * 60 * 60 * 1000)
    return {
      year: completionDate.getFullYear(),
      month: completionDate.getMonth() + 1,
      day: completionDate.getDate()
    }
  }
}
