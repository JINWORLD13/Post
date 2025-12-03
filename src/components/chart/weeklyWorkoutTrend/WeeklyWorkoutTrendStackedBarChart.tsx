import { useState, useRef, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { WeeklyWorkoutTrend } from "../../../types/chart";
import { getWeeklyWorkoutTrendApi } from "../../../api/chart/chartApi";
import styles from "./WeeklyWorkoutTrendStackedBarChart.module.scss";

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
    <div className={styles.item}>
      <div className={`${styles.content} ${isHidden ? styles.hidden : ""}`}>
        <div className={styles.wrapper}>
          <div
            className={styles.box}
            style={{
              backgroundColor: colors[entry.value] || entry.color,
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
            className={styles.input}
          />
        </div>
        <span
          onClick={(e) => {
            e.stopPropagation();
            onLegendClick(entry.value);
          }}
          className={styles.text}
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
    <div className={styles.legend}>
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

const WeeklyWorkoutTrendStackedBarChart = () => {
  // 상태 관리
  const [data, setData] = useState<WeeklyWorkoutTrend[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getWeeklyWorkoutTrendApi();
        // API 응답이 배열인지 확인
        const dataArray = Array.isArray(response) ? response : [];
        setData(dataArray);
      } catch {
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
      <h2>주간 운동 트렌드 - 스택 바 차트</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={Array.isArray(data) ? data : []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis
            label={{
              value: "비율 (%)",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip />
          {!hiddenItems.includes("running") && (
            <Bar
              dataKey="running"
              stackId="a"
              fill={colors.running || DEFAULT_COLORS.running}
              name="러닝"
            />
          )}
          {!hiddenItems.includes("cycling") && (
            <Bar
              dataKey="cycling"
              stackId="a"
              fill={colors.cycling || DEFAULT_COLORS.cycling}
              name="사이클링"
            />
          )}
          {!hiddenItems.includes("stretching") && (
            <Bar
              dataKey="stretching"
              stackId="a"
              fill={colors.stretching || DEFAULT_COLORS.stretching}
              name="스트레칭"
            />
          )}
        </BarChart>
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

export default WeeklyWorkoutTrendStackedBarChart;
