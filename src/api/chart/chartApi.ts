import apiClient from "../axios";

export const getPostsApi = async () => {
  const response = await apiClient.get("/mock/posts");
  return response?.data;
};

export const getTopCoffeeBrandsApi = async () => {
  const response = await apiClient.get("/mock/top-coffee-brands");
  return response?.data;
};

export const getPopularSnackBrandsApi = async () => {
  const response = await apiClient.get("/mock/popular-snack-brands");
  return response?.data;
};

export const getWeeklyMoodTrendApi = async () => {
  const response = await apiClient.get("/mock/weekly-mood-trend");
  return response?.data;
};

export const geWeeklyWorkoutTrendApi = async () => {
  const response = await apiClient.get("/mock/weekly-workout-trend");
  return response?.data;
};

export const getCoffeeConsumptionApi = async () => {
  const response = await apiClient.get("/mock/coffee-consumption");
  return response?.data;
};

export const getSnackImpactApi = async () => {
  const response = await apiClient.get("/mock/snack-impact");
  return response?.data;
};
