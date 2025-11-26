import apiClient from "../axios";

export const loginApi = async ({
  email,
  password,
  signal,
}: {
  email: string;
  password: string;
  signal?: AbortSignal;
}) => {
  const response = await apiClient.post(
    "/auth/login",
    { email, password },
    { signal }
  );
  return response.data;
};
