// Mock 서버 함수들
// 실제 API 호출 대신 Mock 데이터를 사용하는 함수들

import {
  mockLogin,
  mockGetPosts,
  mockCreatePost,
  mockUpdatePost,
  mockDeletePost,
} from "./mockData";
import type {
  PostCreateRequest,
  PostUpdateRequest,
  Category,
  SortField,
  SortOrder,
} from "../../types/post";

// Mock 로그인 API
export const mockLoginApi = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  // 실제 API처럼 비동기 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockLogin(email, password);
};

// Mock 게시글 목록 조회 API
export const mockGetPostsApi = async (params?: {
  search?: string;
  category?: Category;
  sortField?: SortField;
  sortOrder?: SortOrder;
  userId?: string;
}) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockGetPosts(params);
};

// Mock 게시글 생성 API
export const mockCreatePostApi = async ({
  post,
  signal,
}: {
  post: PostCreateRequest;
  signal?: AbortSignal;
}) => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // AbortSignal 체크
  if (signal?.aborted) {
    throw new Error("Request aborted");
  }

  const userId = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!).id
    : null;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  return mockCreatePost(post, userId);
};

// Mock 게시글 수정 API
export const mockUpdatePostApi = async (
  id: string,
  post: PostUpdateRequest
) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const updated = mockUpdatePost(id, post);
  if (!updated) {
    throw new Error("Post not found");
  }
  return updated;
};

// Mock 게시글 삭제 API
export const mockDeletePostApi = async (id: string) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const deleted = mockDeletePost(id);
  if (!deleted) {
    throw new Error("Post not found");
  }
  return { success: true };
};
