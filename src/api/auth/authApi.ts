import apiClient from "../axios";
import { USE_MOCK_MODE } from "../../config/apiConfig";
import { mockLoginApi } from "../mock/mockServer";

export const loginApi = async ({
  email,
  password,
  signal,
}: {
  email: string;
  password: string;
  signal?: AbortSignal;
}) => {
  // Mock 모드일 경우 Mock 서버 사용
  if (USE_MOCK_MODE) {
    return await mockLoginApi({ email, password });
  }

  // 실제 API 호출
  const response = await apiClient.post(
    "/auth/login",
    { email, password },
    { signal }
  );
  return response.data;
};
