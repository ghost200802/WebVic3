export enum Era {
  STONE_AGE = 'stone_age',
  BRONZE_AGE = 'bronze_age',
  IRON_AGE = 'iron_age',
  CLASSICAL = 'classical',
  MEDIEVAL = 'medieval',
  RENAISSANCE = 'renaissance',
  INDUSTRIAL = 'industrial',
  ELECTRICAL = 'electrical',
  INFORMATION = 'information',
  AI_AGE = 'ai_age'
}

export enum BuildingType {
  FARM = 'farm',
  RANCH = 'ranch',
  FORESTRY = 'forestry',
  FISHERY = 'fishery',
  QUARRY = 'quarry',
  MINE = 'mine',
  WORKSHOP = 'workshop',
  FACTORY = 'factory',
  MODERN_FACTORY = 'modern_factory',
  WAREHOUSE = 'warehouse',
  MARKET = 'market',
  PORT = 'port',
  TRAIN_STATION = 'train_station',
  ACADEMY = 'academy',
  UNIVERSITY = 'university',
  LABORATORY = 'laboratory'
}

export enum GoodsType {
  RAW_MATERIAL = 'raw_material',
  INTERMEDIATE = 'intermediate',
  FINAL = 'final',
  LUXURY = 'luxury',
  MILITARY = 'military'
}

export enum AgeGroup {
  CHILD = 'child',
  ADULT = 'adult',
  ELDER = 'elder'
}

export enum EducationLevel {
  ILLITERATE = 'illiterate',
  BASIC = 'basic',
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  UNIVERSITY = 'university',
  POSTGRADUATE = 'postgraduate'
}

export enum SocialClass {
  ELITE = 'elite',
  MIDDLE = 'middle',
  WORKER = 'worker',
  POOR = 'poor'
}

export enum EmploymentStatus {
  EMPLOYED = 'employed',
  UNEMPLOYED = 'unemployed',
  RETIRED = 'retired'
}

export enum TerrainType {
  PLAINS = 'plains',
  FOREST = 'forest',
  HILLS = 'hills',
  WATER = 'water',
  DESERT = 'desert',
  SNOW = 'snow',
  SWAMP = 'swamp',
  MOUNTAIN = 'mountain'
}

export interface GameDate {
  year: number
  month: number
  day: number
}

export const createGameDate = (year: number, month: number, day: number): GameDate => ({
  year,
  month,
  day
})
