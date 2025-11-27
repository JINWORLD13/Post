import { useState, useRef, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { CoffeeBrand } from "../../../types/chart";
import { getTopCoffeeBrandsApi } from "../../../api/chart/chartApi";
import styles from "./CoffeeBrandsDonutChart.module.scss";

// 커스텀 범례 컴포넌트
const CustomLegend = ({
  payload,
  hiddenItems,
  onLegendClick,
  onColorChange,
}: {
  payload?: Array<{ value: string; color: string }>;
  hiddenItems: string[];
  onLegendClick: (brandName: string) => void;
  onColorChange: (brandName: string, newColor: string) => void;
}) => {
  const colorPickerRefs = useRef<{ [key: string]: HTMLInputElement | null }>(
    {}
  );

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
          <div
            key={`legend-${index}`}
            style={{
              display: "flex",
              alignItems: "center",
              opacity: isHidden ? 0.5 : 1,
            }}
          >
            <div style={{ position: "relative", marginRight: "8px" }}>
              <div
                style={{
                  width: "14px",
                  height: "14px",
                  backgroundColor: entry.color,
                  borderRadius: "2px",
                  border: "1px solid #ccc",
                  pointerEvents: "none",
                }}
              />
              <input
                ref={(el) => {
                  colorPickerRefs.current[entry.value] = el;
                }}
                type="color"
                value={entry.color}
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
              onClick={() => onLegendClick(entry.value)}
              style={{ color: "#000", cursor: "pointer" }}
            >
              {entry.value}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// Mock 데이터
// const mockData: CoffeeBrand[] = [
//   { brand: "Starbucks", value: 45 },
//   { brand: "Dunkin", value: 32 },
//   { brand: "Tim Hortons", value: 28 },
//   { brand: "Peet's Coffee", value: 22 },
//   { brand: "Costa Coffee", value: 18 },
// ];

// 각 브랜드별 색상
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const CoffeeBrandsDonutChart = () => {
  const [data, setData] = useState<CoffeeBrand[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTopCoffeeBrandsApi();
        // API 응답이 배열인지 확인하고 popularity를 value로 매핑
        if (Array.isArray(response)) {
          const mappedData = response.map((item: any) => ({
            brand: item.brand,
            value: item.popularity || item.value || 0,
          }));
          setData(mappedData);
        } else {
          setData([]);
        }
      } catch (error) {
        setData([]);
      }
    };
    fetchData();
  }, []);
  const [hiddenItems, setHiddenItems] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>(COLORS);

  // 범례 클릭 시 데이터 보이기/숨기기
  // brandName: 클릭한 범례의 브랜드 이름 (예: "Starbucks")
  const handleLegendClick = (brandName: string) => {
    if (hiddenItems.includes(brandName)) {
      // 이미 숨겨져 있으면 → 보이게 하기 (배열에서 제거)
      setHiddenItems(hiddenItems.filter((item) => item !== brandName));
    } else {
      // 보이고 있으면 → 숨기기 (배열에 추가)
      setHiddenItems([...hiddenItems, brandName]);
    }
  };

  // 색상 변경
  const handleColorChange = (brand: string, newColor: string) => {
    if (!Array.isArray(data)) return;
    const brandIndex = data.findIndex((item) => item.brand === brand);
    if (brandIndex !== -1) {
      const newColors = [...colors];
      newColors[brandIndex] = newColor;
      setColors(newColors);
    }
  };

  // 숨겨진 항목 제외한 데이터 (비율 재계산을 위해)
  const filteredData = Array.isArray(data)
    ? data.filter((item) => !hiddenItems.includes(item.brand))
    : [];

  // 범례용 데이터 생성 (모든 항목 포함, 원본 인덱스로 색상 매핑)
  const legendPayload = Array.isArray(data)
    ? data.map((item, index) => ({
        value: item.brand,
        color: colors[index] || COLORS[index % COLORS.length],
      }))
    : [];

  return (
    <div className={styles.container}>
      <h2>Top Coffee Brands - Donut Chart</h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={filteredData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            innerRadius={60}
            fill="#8884d8"
            dataKey="value"
            nameKey="brand"
          >
            {filteredData.map((entry) => {
              // 원본 데이터에서의 인덱스를 찾아서 색상 매핑
              const originalIndex = Array.isArray(data)
                ? data.findIndex((item) => item.brand === entry.brand)
                : -1;
              return (
                <Cell
                  key={`cell-${entry.brand}`}
                  fill={
                    originalIndex !== -1
                      ? colors[originalIndex] ||
                        COLORS[originalIndex % COLORS.length]
                      : COLORS[0]
                  }
                />
              );
            })}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      {/* 커스텀 범례 - PieChart 밖에 배치하여 항상 표시 */}
      <CustomLegend
        payload={legendPayload}
        hiddenItems={hiddenItems}
        onLegendClick={handleLegendClick}
        onColorChange={handleColorChange}
      />
    </div>
  );
};

export default CoffeeBrandsDonutChart;
