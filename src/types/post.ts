export const Category = {
  ALL: "All",
  NOTICE: "NOTICE",
  QNA: "QNA",
  FREE: "FREE",
} as const;

export type Category = (typeof Category)[keyof typeof Category];

export type SortField = "title" | "createdAt";
export type SortOrder = "asc" | "desc";

export interface Post {
  id: string;
  title: string;
  body: string;
  category: Category;
  userId: string;
  email?: string; // 글쓴 사람의 email
  tags: string[];
  createdAt: string;
}

// API 요청용 타입 (새 게시글 작성 시)
export interface PostCreateRequest {
  title: string;
  body: string;
  category: Category;
  tags: string[];
}

// API 요청용 타입 (게시글 수정 시)
export interface PostUpdateRequest {
  title?: string;
  body?: string;
  category?: Category;
  tags?: string[];
}
