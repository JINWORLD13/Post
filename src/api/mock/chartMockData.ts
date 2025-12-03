// 차트용 Mock 데이터

// 커피 브랜드 Mock 데이터
export const mockTopCoffeeBrands = [
  { brand: "Starbucks", value: 45 },
  { brand: "Dunkin'", value: 32 },
  { brand: "Peet's Coffee", value: 28 },
  { brand: "Tim Hortons", value: 22 },
  { brand: "Costa Coffee", value: 18 },
];

// 스낵 브랜드 Mock 데이터
export const mockPopularSnackBrands = [
  { brand: "Lay's", value: 38 },
  { brand: "Doritos", value: 35 },
  { brand: "Pringles", value: 29 },
  { brand: "Cheetos", value: 25 },
  { brand: "Ruffles", value: 21 },
];

// 주간 기분 트렌드 Mock 데이터
export const mockWeeklyMoodTrend = [
  { week: "Week 1", happy: 45, tired: 30, stressed: 25 },
  { week: "Week 2", happy: 50, tired: 25, stressed: 25 },
  { week: "Week 3", happy: 40, tired: 35, stressed: 25 },
  { week: "Week 4", happy: 55, tired: 20, stressed: 25 },
  { week: "Week 5", happy: 48, tired: 27, stressed: 25 },
  { week: "Week 6", happy: 42, tired: 33, stressed: 25 },
];

// 주간 운동 트렌드 Mock 데이터
export const mockWeeklyWorkoutTrend = [
  { week: "Week 1", running: 35, cycling: 30, stretching: 35 },
  { week: "Week 2", running: 40, cycling: 25, stretching: 35 },
  { week: "Week 3", running: 30, cycling: 35, stretching: 35 },
  { week: "Week 4", running: 45, cycling: 20, stretching: 35 },
  { week: "Week 5", running: 38, cycling: 27, stretching: 35 },
  { week: "Week 6", running: 32, cycling: 33, stretching: 35 },
];

// 커피 소비량 Mock 데이터 (API 응답 형식)
export const mockCoffeeConsumption = {
  teams: [
    {
      team: "Frontend",
      series: [
        { cups: 1, bugs: 5, productivity: 75 },
        { cups: 2, bugs: 4, productivity: 80 },
        { cups: 3, bugs: 3, productivity: 85 },
        { cups: 4, bugs: 2, productivity: 88 },
        { cups: 5, bugs: 1, productivity: 90 },
      ],
    },
    {
      team: "Backend",
      series: [
        { cups: 1, bugs: 3, productivity: 85 },
        { cups: 2, bugs: 2, productivity: 90 },
        { cups: 3, bugs: 1, productivity: 95 },
        { cups: 4, bugs: 0, productivity: 98 },
        { cups: 5, bugs: 0, productivity: 100 },
      ],
    },
    {
      team: "AI",
      series: [
        { cups: 1, bugs: 4, productivity: 70 },
        { cups: 2, bugs: 3, productivity: 75 },
        { cups: 3, bugs: 2, productivity: 80 },
        { cups: 4, bugs: 1, productivity: 85 },
        { cups: 5, bugs: 0, productivity: 88 },
      ],
    },
  ],
};

// 스낵 임팩트 Mock 데이터 (API 응답 형식)
export const mockSnackImpact = {
  departments: [
    {
      name: "Frontend",
      metrics: [
        { snacks: 0, meetingsMissed: 3, morale: 65 },
        { snacks: 1, meetingsMissed: 2, morale: 75 },
        { snacks: 2, meetingsMissed: 1, morale: 82 },
        { snacks: 3, meetingsMissed: 0, morale: 87 },
        { snacks: 4, meetingsMissed: 0, morale: 90 },
      ],
    },
    {
      name: "Backend",
      metrics: [
        { snacks: 0, meetingsMissed: 2, morale: 72 },
        { snacks: 1, meetingsMissed: 1, morale: 82 },
        { snacks: 2, meetingsMissed: 0, morale: 88 },
        { snacks: 3, meetingsMissed: 0, morale: 92 },
        { snacks: 4, meetingsMissed: 0, morale: 95 },
      ],
    },
    {
      name: "AI",
      metrics: [
        { snacks: 0, meetingsMissed: 4, morale: 62 },
        { snacks: 1, meetingsMissed: 3, morale: 70 },
        { snacks: 2, meetingsMissed: 2, morale: 78 },
        { snacks: 3, meetingsMissed: 1, morale: 82 },
        { snacks: 4, meetingsMissed: 0, morale: 85 },
      ],
    },
  ],
};
