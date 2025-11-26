export const Category = {
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
  tags: string[];
  createdAt: string;
}
