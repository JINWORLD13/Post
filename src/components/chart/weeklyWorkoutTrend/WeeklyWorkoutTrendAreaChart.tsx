import { useState, useRef, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { WeeklyWorkoutTrend } from "../../../types/chart";
import { getWeeklyWorkoutTrendApi } from "../../../api/chart/chartApi";
import styles from "./WeeklyWorkoutTrendAreaChart.module.scss";

// 범례 항목 컴포넌트
const LegendItem = ({
  entry,
  isHidden,
  colors,
  onLegendClick,
  onColorChange,
}: {
  entry: { value: string; color: string };
  isHidden: boolean;
  colors: Record<string, string>;
  onLegendClick: (itemName: string) => void;
  onColorChange: (itemName: string, newColor: string) => void;
}) => {
  const colorPickerRef = useRef<HTMLInputElement | null>(null);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{ display: "flex", alignItems: "center", opacity: isHidden ? 0.5 : 1 }}>
        <div style={{ position: "relative", marginRight: "8px" }}>
          <div
            style={{
              width: "14px",
              height: "14px",
              backgroundColor: colors[entry.value] || entry.color,
              borderRadius: "2px",
              border: "1px solid #ccc",
              pointerEvents: "none",
            }}
          />
          <input
            ref={colorPickerRef}
            type="color"
            value={colors[entry.value] || entry.color}
            onChange={(e) => {
              onColorChange(entry.value, e.target.value);
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
              opacity: 0,
              padding: 0,
            }}
          />
        </div>
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

// 범례 컴포넌트
const CustomLegend = ({
  payload,
  hiddenItems,
  onLegendClick,
  colors,
  onColorChange,
}: {
  payload?: Array<{ value: string; color: string }>;
  hiddenItems: string[];
  onLegendClick: (itemName: string) => void;
  colors: Record<string, string>;
  onColorChange: (itemName: string, newColor: string) => void;
}) => {
  if (!payload) return null;

  return (
    <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "16px", marginTop: "20px" }}>
      {payload.map((entry, index) => {
        const isHidden = hiddenItems.includes(entry.value);
        return (
          <LegendItem
            key={index}
            entry={entry}
            isHidden={isHidden}
            colors={colors}
            onLegendClick={onLegendClick}
            onColorChange={onColorChange}
          />
        );
      })}
    </div>
  );
};

// 목 데이터
// const mockData: WeeklyWorkoutTrend[] = [
//   { week: "Week 1", running: 35, cycling: 30, stretching: 35 },
//   { week: "Week 2", running: 40, cycling: 25, stretching: 35 },
//   { week: "Week 3", running: 30, cycling: 35, stretching: 35 },
//   { week: "Week 4", running: 45, cycling: 20, stretching: 35 },
//   { week: "Week 5", running: 38, cycling: 27, stretching: 35 },
//   { week: "Week 6", running: 32, cycling: 33, stretching: 35 },
// ];

// 기본 색상 설정
const DEFAULT_COLORS = {
  running: "#0088FE",
  cycling: "#00C49F",
  stretching: "#8884d8",
};

const WeeklyWorkoutTrendAreaChart = () => {
  // 상태 관리
  const [data, setData] = useState<WeeklyWorkoutTrend[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getWeeklyWorkoutTrendApi();
        // API 응답이 배열인지 확인
        const dataArray = Array.isArray(response) ? response : [];
        setData(dataArray);
      } catch (error) {
        setData([]);
      }
    };
    fetchData();
  }, []);
  const [hiddenItems, setHiddenItems] = useState<string[]>([]);
  const [colors, setColors] = useState<Record<string, string>>(DEFAULT_COLORS);

  // 범례 클릭하면 보이기/숨기기
  const handleLegendClick = (itemName: string) => {
    if (hiddenItems.includes(itemName)) {
      // 숨겨져 있으면 보이게
      setHiddenItems(hiddenItems.filter((item) => item !== itemName));
    } else {
      // 보이고 있으면 숨기기
      setHiddenItems([...hiddenItems, itemName]);
    }
  };

  // 색상 변경
  const handleColorChange = (itemName: string, newColor: string) => {
    setColors((prev) => ({
      ...prev,
      [itemName]: newColor,
    }));
  };

  // 범례 데이터
  const legendPayload = [
    { value: "running", color: colors.running },
    { value: "cycling", color: colors.cycling },
    { value: "stretching", color: colors.stretching },
  ];

  return (
    <div className={styles.container}>
      <h2>Weekly Workout Trend - Area Chart</h2>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={Array.isArray(data) ? data : []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis label={{ value: "Percentage (%)", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          {!hiddenItems.includes("running") && (
            <Area
              type="monotone"
              dataKey="running"
              stackId="1"
              stroke={colors.running || DEFAULT_COLORS.running}
              fill={colors.running || DEFAULT_COLORS.running}
              name="Running"
            />
          )}
          {!hiddenItems.includes("cycling") && (
            <Area
              type="monotone"
              dataKey="cycling"
              stackId="1"
              stroke={colors.cycling || DEFAULT_COLORS.cycling}
              fill={colors.cycling || DEFAULT_COLORS.cycling}
              name="Cycling"
            />
          )}
          {!hiddenItems.includes("stretching") && (
            <Area
              type="monotone"
              dataKey="stretching"
              stackId="1"
              stroke={colors.stretching || DEFAULT_COLORS.stretching}
              fill={colors.stretching || DEFAULT_COLORS.stretching}
              name="Stretching"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
      <CustomLegend
        payload={legendPayload}
        hiddenItems={hiddenItems}
        onLegendClick={handleLegendClick}
        colors={colors}
        onColorChange={handleColorChange}
      />
    </div>
  );
};

export default WeeklyWorkoutTrendAreaChart;

