import React from "react";
import Input from "../../ui/input/Input";
import Select from "../../ui/select/Select";
import { Category, type SortField, type SortOrder } from "../../../types/post";
import styles from "./PostFilters.module.scss";

interface PostFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortField: SortField;
  onSortFieldChange: (field: SortField) => void;
  sortOrder: SortOrder;
  onSortOrderChange: (order: SortOrder) => void;
  categoryFilter: Category | "all";
  onCategoryFilterChange: (category: Category) => void;
}

const PostFilters: React.FC<PostFiltersProps> = ({
  searchQuery,
  onSearchChange,
  sortField,
  onSortFieldChange,
  sortOrder,
  onSortOrderChange,
  categoryFilter,
  onCategoryFilterChange,
}) => {
  const sortFieldOptions = [
    { value: "title", label: "제목" },
    { value: "createdAt", label: "날짜" },
  ];

  const sortOrderOptions = [
    { value: "asc", label: "오름차순" },
    { value: "desc", label: "내림차순" },
  ];

  const categoryOptions = [
    { value: Category.ALL, label: "전체" },
    { value: Category.NOTICE, label: "공지" },
    { value: Category.QNA, label: "Q&A" },
    { value: Category.FREE, label: "자유" },
  ];

  return (
    <div className={styles.filters}>
      <div className={styles["filter-group"]}>
        <Input
          id="search"
          name="search"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="제목 또는 내용 검색..."
          label="검색"
        />
      </div>

      <div className={styles["filter-group"]}>
        <Select
          id="category"
          name="category"
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value as Category)}
          label="카테고리"
          options={categoryOptions}
        />
      </div>

      <div className={styles["filter-group"]}>
        <Select
          id="sortField"
          name="sortField"
          value={sortField}
          onChange={(e) => onSortFieldChange(e.target.value as SortField)}
          label="정렬 필드"
          options={sortFieldOptions}
        />
      </div>

      <div className={styles["filter-group"]}>
        <Select
          id="sortOrder"
          name="sortOrder"
          value={sortOrder}
          onChange={(e) => onSortOrderChange(e.target.value as SortOrder)}
          label="정렬 순서"
          options={sortOrderOptions}
        />
      </div>
    </div>
  );
};

export default PostFilters;
