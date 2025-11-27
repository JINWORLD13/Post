export interface CoffeeBrand {
  brand: string;
  value: number;
  [key: string]: string | number;
}

export interface SnackBrand {
  brand: string;
  value: number;
  [key: string]: string | number;
}

export interface WeeklyMoodTrend {
  week: string;
  happy: number;
  tired: number;
  stressed: number;
}

export interface WeeklyWorkoutTrend {
  week: string;
  running: number;
  cycling: number;
  stretching: number;
}

export interface TeamDataPoint {
  team: string;
  bugs: number;
  meetingMissed: number;
  productivity: number;
  morale: number;
}

export interface CoffeeConsumptionData {
  coffeeCups: number;
  teams: TeamDataPoint[];
}

export interface SnackImpactData {
  snackCount: number;
  teams: TeamDataPoint[];
}

