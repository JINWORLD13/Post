import { useState, useRef, useMemo, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { CoffeeConsumptionData, TeamDataPoint } from "../../../types/chart";
import { getCoffeeConsumptionApi } from "../../../api/chart/chartApi";
import styles from "./CoffeeConsumptionMultiLineChart.module.scss";

/**
 * 사각형 모양의 데이터 포인트 마커 컴포넌트
 * 생산성과 사기 점수를 표시할 때 사용합니다.
 */
const SquareDot = ({ cx, cy, fill }: { cx?: number; cy?: number; fill?: string }) => {
  // cx, cy, fill 값이 없으면 마커를 표시하지 않음
  if (cx === undefined || cy === undefined || !fill) return null;
  
  const size = 5; // 사각형 크기
  
  return (
    <rect
      x={cx - size}
      y={cy - size}
      width={size * 2}
      height={size * 2}
      fill={fill}
      stroke={fill}
      strokeWidth={1}
    />
  );
};

/**
 * 범례의 각 항목을 표시하는 컴포넌트
 * 색상 변경과 보이기/숨기기 기능을 제공합니다.
 */
const LegendItem = ({
  entry,
  isHidden,
  teamColors,
  onLegendClick,
  onColorChange,
}: {
  entry: { value: string; color: string; lineType?: "solid" | "dashed"; team: string };
  isHidden: boolean;
  teamColors: Record<string, string>;
  onLegendClick: (itemName: string) => void;
  onColorChange: (teamName: string, newColor: string) => void;
}) => {
  const colorPickerRef = useRef<HTMLInputElement | null>(null);
  
  // 현재 팀의 색상을 가져옴 (색상이 변경되었을 수 있으므로 최신 색상 사용)
  const currentColor = teamColors[entry.team] || entry.color;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{ display: "flex", alignItems: "center", opacity: isHidden ? 0.5 : 1 }}>
        {/* 색상 표시 박스 */}
        <div style={{ position: "relative", marginRight: "8px" }}>
          <div
            style={{
              width: "14px",
              height: "14px",
              backgroundColor: currentColor,
              // 점선 라인은 사각형, 실선 라인은 원형으로 표시
              borderRadius: entry.lineType === "dashed" ? "0" : "50%",
              border: "1px solid #ccc",
              pointerEvents: "none",
            }}
          />
          {/* 색상 변경을 위한 숨겨진 색상 선택기 */}
          <input
            ref={colorPickerRef}
            type="color"
            value={currentColor}
            onChange={(e) => {
              // 팀의 색상을 변경하면 같은 팀의 모든 라인이 같은 색상으로 변경됨
              onColorChange(entry.team, e.target.value);
            }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "14px",
              height: "14px",
              border: "none",
              cursor: "pointer",
              opacity: 0, // 투명하게 만들어 클릭 가능하게 함
              padding: 0,
            }}
          />
        </div>
        
        {/* 점선 라인인 경우 점선 표시 */}
        {entry.lineType === "dashed" && (
          <div
            style={{
              width: "14px",
              height: "2px",
              borderTop: `2px dashed ${currentColor}`,
              marginRight: "4px",
            }}
          />
        )}
        
        {/* 범례 항목 이름 (클릭하면 보이기/숨기기) */}
        <span
          onClick={(e) => {
            e.stopPropagation();
            onLegendClick(entry.value);
          }}
          style={{ color: "#000", cursor: "pointer" }}
        >
          {entry.value}
        </span>
      </div>
    </div>
  );
};

/**
 * 커스텀 범례 컴포넌트
 * 모든 범례 항목을 표시하고 관리합니다.
 */
const CustomLegend = ({
  payload,
  hiddenItems,
  onLegendClick,
  teamColors,
  onColorChange,
}: {
  payload?: Array<{ value: string; color: string; lineType?: "solid" | "dashed"; team: string }>;
  hiddenItems: string[];
  onLegendClick: (itemName: string) => void;
  teamColors: Record<string, string>;
  onColorChange: (teamName: string, newColor: string) => void;
}) => {
  if (!payload) return null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "16px",
        marginTop: "20px",
      }}
    >
      {payload.map((entry, index) => {
        const isHidden = hiddenItems.includes(entry.value);
        return (
          <LegendItem
            key={index}
            entry={entry}
            isHidden={isHidden}
            teamColors={teamColors}
            onLegendClick={onLegendClick}
            onColorChange={onColorChange}
          />
        );
      })}
    </div>
  );
};

/**
 * 커스텀 툴팁 컴포넌트
 * 차트 위에 마우스를 올렸을 때 데이터를 보여줍니다.
 * 호버한 라인의 해당 팀 데이터만 표시합니다.
 */
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    payload: any;
    stroke: string;
    name: string;
  }>;
  label?: number;
}) => {
  // 툴팁이 활성화되지 않았거나 데이터가 없으면 표시하지 않음
  if (!active || !payload || !payload.length) return null;

  // 호버한 라인에서 팀 이름과 데이터 종류를 추출
  // 예: "Frontend_bugs" -> ["Frontend", "bugs"]
  const dataKey = payload[0].dataKey as string;
  const teamMatch = dataKey.match(/^(.+?)_(bugs|meetingMissed|productivity|morale)$/);
  if (!teamMatch) return null;

  const teamName = teamMatch[1]; // 팀 이름 (예: "Frontend")
  const coffeeCups = label; // X축 값 (커피 잔수)
  const hoveredPayload = payload[0].payload; // 해당 데이터 포인트의 전체 데이터

  // 해당 팀의 모든 데이터를 가져옴
  const teamData = {
    team: teamName,
    coffeeCups: coffeeCups,
    bugs: hoveredPayload[`${teamName}_bugs`],
    meetingMissed: hoveredPayload[`${teamName}_meetingMissed`],
    productivity: hoveredPayload[`${teamName}_productivity`],
    morale: hoveredPayload[`${teamName}_morale`],
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "10px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>
        커피 잔수: {coffeeCups}잔
      </p>
      <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>팀: {teamName}</p>
      <p style={{ margin: "4px 0", color: payload[0].stroke }}>
        버그 수: {teamData.bugs}
      </p>
      <p style={{ margin: "4px 0", color: payload[0].stroke }}>
        생산성: {teamData.productivity}
      </p>
    </div>
  );
};

// 목 데이터 (실제로는 API에서 가져올 데이터)
// const mockData: CoffeeConsumptionData[] = [
//   {
//     coffeeCups: 1,
//     teams: [
//       { team: "Frontend", bugs: 5, meetingMissed: 2, productivity: 75, morale: 80 },
//       { team: "Backend", bugs: 3, meetingMissed: 1, productivity: 85, morale: 85 },
//       { team: "AI", bugs: 4, meetingMissed: 3, productivity: 70, morale: 75 },
//     ],
//   },
//   {
//     coffeeCups: 2,
//     teams: [
//       { team: "Frontend", bugs: 4, meetingMissed: 1, productivity: 80, morale: 82 },
//       { team: "Backend", bugs: 2, meetingMissed: 0, productivity: 90, morale: 88 },
//       { team: "AI", bugs: 3, meetingMissed: 2, productivity: 75, morale: 78 },
//     ],
//   },
//   {
//     coffeeCups: 3,
//     teams: [
//       { team: "Frontend", bugs: 3, meetingMissed: 1, productivity: 85, morale: 85 },
//       { team: "Backend", bugs: 1, meetingMissed: 0, productivity: 95, morale: 90 },
//       { team: "AI", bugs: 2, meetingMissed: 1, productivity: 80, morale: 80 },
//     ],
//   },
//   {
//     coffeeCups: 4,
//     teams: [
//       { team: "Frontend", bugs: 2, meetingMissed: 0, productivity: 88, morale: 87 },
//       { team: "Backend", bugs: 0, meetingMissed: 0, productivity: 98, morale: 92 },
//       { team: "AI", bugs: 1, meetingMissed: 0, productivity: 85, morale: 82 },
//     ],
//   },
//   {
//     coffeeCups: 5,
//     teams: [
//       { team: "Frontend", bugs: 1, meetingMissed: 0, productivity: 90, morale: 90 },
//       { team: "Backend", bugs: 0, meetingMissed: 0, productivity: 100, morale: 95 },
//       { team: "AI", bugs: 0, meetingMissed: 0, productivity: 88, morale: 85 },
//     ],
//   },
// ];

// 각 팀의 기본 색상
const DEFAULT_TEAM_COLORS: Record<string, string> = {
  Frontend: "#0088FE",  // 파란색
  Backend: "#00C49F",   // 초록색
  AI: "#FF8042",        // 주황색
};

/**
 * 커피 소비량 멀티라인 차트 컴포넌트
 * - X축: 커피 섭취량 (잔/일)
 * - 왼쪽 Y축: 버그 수, 회의불참
 * - 오른쪽 Y축: 생산성 점수, 사기
 * - 각 팀별로 4개의 라인을 표시 (버그 수, 회의불참, 생산성, 사기)
 */
const CoffeeConsumptionMultiLineChart = () => {
  // 상태 관리
  const [data, setData] = useState<CoffeeConsumptionData[]>([]); // 차트 데이터
  const [hiddenItems, setHiddenItems] = useState<string[]>([]); // 숨겨진 항목 목록
  const [teamColors, setTeamColors] = useState<Record<string, string>>(DEFAULT_TEAM_COLORS); // 팀별 색상

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCoffeeConsumptionApi();
        // API 응답 구조: { teams: [{ team, series: [{ cups, bugs, productivity }] }] }
        // 우리 타입: [{ coffeeCups, teams: [{ team, bugs, meetingMissed, productivity, morale }] }]
        if (response && response.teams && Array.isArray(response.teams)) {
          // 모든 팀의 series에서 cups 값들을 수집
          const allCups = new Set<number>();
          response.teams.forEach((team: any) => {
            if (team.series && Array.isArray(team.series)) {
              team.series.forEach((point: any) => {
                if (point.cups !== undefined) {
                  allCups.add(point.cups);
                }
              });
            }
          });

          // cups 값으로 정렬
          const sortedCups = Array.from(allCups).sort((a, b) => a - b);

          // 변환된 데이터 생성
          const transformedData: CoffeeConsumptionData[] = sortedCups.map((cups) => {
            const teams: TeamDataPoint[] = response.teams.map((team: any) => {
              // 해당 cups에 맞는 series 데이터 찾기
              const seriesPoint = team.series?.find((p: any) => p.cups === cups);
              return {
                team: team.team,
                bugs: seriesPoint?.bugs || 0,
                meetingMissed: 0, // API에 없으므로 기본값
                productivity: seriesPoint?.productivity || 0,
                morale: 0, // API에 없으므로 기본값
              };
            });
            return {
              coffeeCups: cups,
              teams,
            };
          });

          setData(transformedData);
        } else {
          setData([]);
        }
      } catch (error) {
        setData([]);
      }
    };
    fetchData();
  }, []);

  /**
   * 원본 데이터를 Recharts에서 사용할 수 있는 형태로 변환
   * 예: { coffeeCups: 1, teams: [...] } 
   *  -> { coffeeCups: 1, Frontend_bugs: 5, Frontend_meetingMissed: 2, ... }
   */
  const chartData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.map((item) => {
      const transformed: Record<string, any> = {
        coffeeCups: item.coffeeCups,
      };
      
      // 각 팀의 데이터를 개별 속성으로 변환
      item.teams.forEach((team) => {
        transformed[`${team.team}_bugs`] = team.bugs;
        transformed[`${team.team}_meetingMissed`] = team.meetingMissed;
        transformed[`${team.team}_productivity`] = team.productivity;
        transformed[`${team.team}_morale`] = team.morale;
      });
      
      return transformed;
    });
  }, [data]);

  /**
   * 데이터에서 모든 팀 이름을 추출
   * 예: ["Frontend", "Backend", "AI"]
   */
  const teams = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];
    return data[0].teams.map((t) => t.team);
  }, [data]);

  /**
   * 범례 항목을 클릭했을 때 호출되는 함수
   * 해당 항목을 보이기/숨기기 상태로 전환
   */
  const handleLegendClick = (itemName: string) => {
    if (hiddenItems.includes(itemName)) {
      // 숨겨져 있으면 -> 보이게 하기 (배열에서 제거)
      setHiddenItems(hiddenItems.filter((item) => item !== itemName));
    } else {
      // 보이고 있으면 -> 숨기기 (배열에 추가)
      setHiddenItems([...hiddenItems, itemName]);
    }
  };

  /**
   * 색상을 변경할 때 호출되는 함수
   * 같은 팀의 모든 라인이 같은 색상으로 변경됨
   */
  const handleColorChange = (teamName: string, newColor: string) => {
    setTeamColors((prev) => ({
      ...prev,
      [teamName]: newColor,
    }));
  };

  /**
   * 범례에 표시할 데이터 생성
   * 각 팀마다 4개의 항목 (버그 수, 회의불참, 생산성, 사기)을 생성
   */
  const legendPayload = useMemo(() => {
    const payload: Array<{ value: string; color: string; lineType?: "solid" | "dashed"; team: string }> = [];
    
    teams.forEach((team) => {
      // 현재 팀의 색상 가져오기
      const teamColor = teamColors[team] || DEFAULT_TEAM_COLORS[team] || "#8884d8";
      
      // 각 팀의 4개 항목 추가
      payload.push({
        value: `${team} - 버그 수`,
        color: teamColor,
        lineType: "solid", // 실선
        team: team,
      });
      payload.push({
        value: `${team} - 회의불참`,
        color: teamColor,
        lineType: "solid", // 실선
        team: team,
      });
      payload.push({
        value: `${team} - 생산성`,
        color: teamColor,
        lineType: "dashed", // 점선
        team: team,
      });
      payload.push({
        value: `${team} - 사기`,
        color: teamColor,
        lineType: "dashed", // 점선
        team: team,
      });
    });
    
    return payload;
  }, [teams, teamColors]);

  /**
   * 팀 이름으로 해당 팀의 색상을 가져오는 함수
   */
  const getTeamColor = (team: string) => {
    return teamColors[team] || DEFAULT_TEAM_COLORS[team] || "#8884d8";
  };

  return (
    <div className={styles.container}>
      <h2>Coffee Consumption - Multi-Line Chart</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          {/* 격자 표시 */}
          <CartesianGrid strokeDasharray="3 3" />
          
          {/* X축: 커피 섭취량 */}
          <XAxis
            dataKey="coffeeCups"
            label={{ value: "커피 섭취량 (잔/일)", position: "insideBottom", offset: -5 }}
          />
          
          {/* 왼쪽 Y축: 버그 수, 회의불참 */}
          <YAxis
            yAxisId="left"
            label={{ value: "버그 수, 회의불참", angle: -90, position: "insideLeft" }}
          />
          
          {/* 오른쪽 Y축: 생산성 점수, 사기 */}
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: "생산성 점수, 사기", angle: 90, position: "insideRight" }}
          />
          
          {/* 툴팁 */}
          <Tooltip content={<CustomTooltip />} />
          
          {/* 각 팀별로 4개의 라인을 생성 */}
          {teams.map((team) => {
            const teamColor = getTeamColor(team);
            
            return (
              <g key={team}>
                {/* 버그 수 라인 - 실선, 원형 마커, 왼쪽 Y축 */}
                {!hiddenItems.includes(`${team} - 버그 수`) && (
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey={`${team}_bugs`}
                    stroke={teamColor}
                    strokeWidth={2}
                    dot={{ r: 5, fill: teamColor }} // 원형 마커
                    activeDot={{ r: 7 }} // 호버 시 더 큰 마커
                    name={`${team} - 버그 수`}
                    connectNulls
                  />
                )}
                
                {/* 회의불참 라인 - 실선, 원형 마커, 왼쪽 Y축 */}
                {!hiddenItems.includes(`${team} - 회의불참`) && (
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey={`${team}_meetingMissed`}
                    stroke={teamColor}
                    strokeWidth={2}
                    dot={{ r: 5, fill: teamColor }} // 원형 마커
                    activeDot={{ r: 7 }}
                    name={`${team} - 회의불참`}
                    connectNulls
                  />
                )}
                
                {/* 생산성 라인 - 점선, 사각형 마커, 오른쪽 Y축 */}
                {!hiddenItems.includes(`${team} - 생산성`) && (
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey={`${team}_productivity`}
                    stroke={teamColor}
                    strokeWidth={2}
                    strokeDasharray="5 5" // 점선
                    dot={<SquareDot fill={teamColor} />} // 사각형 마커
                    activeDot={{ r: 7 }}
                    name={`${team} - 생산성`}
                    connectNulls
                  />
                )}
                
                {/* 사기 라인 - 점선, 사각형 마커, 오른쪽 Y축 */}
                {!hiddenItems.includes(`${team} - 사기`) && (
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey={`${team}_morale`}
                    stroke={teamColor}
                    strokeWidth={2}
                    strokeDasharray="5 5" // 점선
                    dot={<SquareDot fill={teamColor} />} // 사각형 마커
                    activeDot={{ r: 7 }}
                    name={`${team} - 사기`}
                    connectNulls
                  />
                )}
              </g>
            );
          })}
        </LineChart>
      </ResponsiveContainer>
      
      {/* 커스텀 범례 */}
      <CustomLegend
        payload={legendPayload}
        hiddenItems={hiddenItems}
        onLegendClick={handleLegendClick}
        teamColors={teamColors}
        onColorChange={handleColorChange}
      />
    </div>
  );
};

export default CoffeeConsumptionMultiLineChart;
