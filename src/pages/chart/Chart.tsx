import CoffeeBrandsBarChart from "../../components/chart/coffeeBrands/CoffeeBrandsBarChart";
import CoffeeBrandsDonutChart from "../../components/chart/coffeeBrands/CoffeeBrandsDonutChart";
import SnackBrandsBarChart from "../../components/chart/snackBrands/SnackBrandsBarChart";
import SnackBrandsDonutChart from "../../components/chart/snackBrands/SnackBrandsDonutChart";
import WeeklyMoodTrendStackedBarChart from "../../components/chart/weeklyMoodTrend/WeeklyMoodTrendStackedBarChart";
import WeeklyMoodTrendAreaChart from "../../components/chart/weeklyMoodTrend/WeeklyMoodTrendAreaChart";
import WeeklyWorkoutTrendStackedBarChart from "../../components/chart/weeklyWorkoutTrend/WeeklyWorkoutTrendStackedBarChart";
import WeeklyWorkoutTrendAreaChart from "../../components/chart/weeklyWorkoutTrend/WeeklyWorkoutTrendAreaChart";
import CoffeeConsumptionMultiLineChart from "../../components/chart/coffeeConsumption/CoffeeConsumptionMultiLineChart";
import SnackImpactMultiLineChart from "../../components/chart/snackImpact/SnackImpactMultiLineChart";
import styles from "./Chart.module.scss";
import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Chart = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <div className={styles.container}>
      <h1>Charts</h1>
      <div className={styles.chartsGrid}>
        <CoffeeBrandsBarChart />
        <CoffeeBrandsDonutChart />
        <SnackBrandsBarChart />
        <SnackBrandsDonutChart />
        <WeeklyMoodTrendStackedBarChart />
        <WeeklyMoodTrendAreaChart />
        <WeeklyWorkoutTrendStackedBarChart />
        <WeeklyWorkoutTrendAreaChart />
        <CoffeeConsumptionMultiLineChart />
        <SnackImpactMultiLineChart />
      </div>
    </div>
  );
};

export default Chart;
