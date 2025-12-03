import apiClient from "../axios";
import { USE_MOCK_MODE } from "../../config/apiConfig";
import {
  mockTopCoffeeBrands,
  mockPopularSnackBrands,
  mockWeeklyMoodTrend,
  mockWeeklyWorkoutTrend,
  mockCoffeeConsumption,
  mockSnackImpact,
} from "../mock/chartMockData";

export const getPostsApi = async () => {
  if (USE_MOCK_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return [];
  }
  const response = await apiClient.get("/mock/posts");
  return response?.data;
};

export const getTopCoffeeBrandsApi = async () => {
  if (USE_MOCK_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockTopCoffeeBrands;
  }
  const response = await apiClient.get("/mock/top-coffee-brands");
  return response?.data;
};

export const getPopularSnackBrandsApi = async () => {
  if (USE_MOCK_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockPopularSnackBrands;
  }
  const response = await apiClient.get("/mock/popular-snack-brands");
  return response?.data;
};

export const getWeeklyMoodTrendApi = async () => {
  if (USE_MOCK_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockWeeklyMoodTrend;
  }
  const response = await apiClient.get("/mock/weekly-mood-trend");
  return response?.data;
};

export const getWeeklyWorkoutTrendApi = async () => {
  if (USE_MOCK_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockWeeklyWorkoutTrend;
  }
  const response = await apiClient.get("/mock/weekly-workout-trend");
  return response?.data;
};

export const getCoffeeConsumptionApi = async () => {
  if (USE_MOCK_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockCoffeeConsumption;
  }
  const response = await apiClient.get("/mock/coffee-consumption");
  return response?.data;
};

export const getSnackImpactApi = async () => {
  if (USE_MOCK_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockSnackImpact;
  }
  const response = await apiClient.get("/mock/snack-impact");
  return response?.data;
};
