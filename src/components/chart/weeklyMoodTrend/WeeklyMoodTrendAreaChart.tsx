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
import type { WeeklyMoodTrend } from "../../../types/chart";
import { getWeeklyMoodTrendApi } from "../../../api/chart/chartApi";
import styles from "./WeeklyMoodTrendAreaChart.module.scss";

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
      <div
        className={`${styles.content} ${isHidden ? styles.hidden : ""}`}
      >
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
// const mockData: WeeklyMoodTrend[] = [
//   { week: "Week 1", happy: 40, tired: 30, stressed: 30 },
//   { week: "Week 2", happy: 35, tired: 35, stressed: 30 },
//   { week: "Week 3", happy: 45, tired: 25, stressed: 30 },
//   { week: "Week 4", happy: 50, tired: 20, stressed: 30 },
//   { week: "Week 5", happy: 42, tired: 28, stressed: 30 },
//   { week: "Week 6", happy: 38, tired: 32, stressed: 30 },
// ];

// 기본 색상 설정
const DEFAULT_COLORS = {
  happy: "#00C49F",
  tired: "#FFBB28",
  stressed: "#FF8042",
};

const WeeklyMoodTrendAreaChart = () => {
  // 상태 관리
  const [data, setData] = useState<WeeklyMoodTrend[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getWeeklyMoodTrendApi();
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
    { value: "happy", color: colors.happy },
    { value: "tired", color: colors.tired },
    { value: "stressed", color: colors.stressed },
  ];

  return (
    <div className={styles.container}>
      <h2>주간 기분 트렌드 - 영역 차트</h2>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={Array.isArray(data) ? data : []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis label={{ value: "비율 (%)", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          {!hiddenItems.includes("happy") && (
            <Area
              type="monotone"
              dataKey="happy"
              stackId="1"
              stroke={colors.happy || DEFAULT_COLORS.happy}
              fill={colors.happy || DEFAULT_COLORS.happy}
              name="행복"
            />
          )}
          {!hiddenItems.includes("tired") && (
            <Area
              type="monotone"
              dataKey="tired"
              stackId="1"
              stroke={colors.tired || DEFAULT_COLORS.tired}
              fill={colors.tired || DEFAULT_COLORS.tired}
              name="피곤"
            />
          )}
          {!hiddenItems.includes("stressed") && (
            <Area
              type="monotone"
              dataKey="stressed"
              stackId="1"
              stroke={colors.stressed || DEFAULT_COLORS.stressed}
              fill={colors.stressed || DEFAULT_COLORS.stressed}
              name="스트레스"
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

export default WeeklyMoodTrendAreaChart;

