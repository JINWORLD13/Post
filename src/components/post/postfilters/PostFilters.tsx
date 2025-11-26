import React from "react";
import Input from "../../ui/Input/Input";
import Select from "../../ui/Select/Select";
import { Category, SortField, SortOrder } from "../../../types/post";
import styles from "./PostFilters.module.scss";

interface PostFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortField: SortField;
  onSortFieldChange: (field: SortField) => void;
  sortOrder: SortOrder;
  onSortOrderChange: (order: SortOrder) => void;
  categoryFilter: Category | "all";
  onCategoryFilterChange: (category: Category | "all") => void;
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
    { value: "title", label: "Title" },
    { value: "createdAt", label: "Time" },
  ];

  const sortOrderOptions = [
    { value: "asc", label: "Asc" },
    { value: "desc", label: "Desc" },
  ];

  const categoryOptions = [
    { value: "all", label: "All" },
    { value: Category.NOTICE, label: "Notice" },
    { value: Category.QNA, label: "Q&A" },
    { value: Category.FREE, label: "Free" },
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
          placeholder="Title or Content Search..."
          label="Search"
        />
      </div>

      <div className={styles["filter-group"]}>
        <Select
          id="category"
          name="category"
          value={categoryFilter}
          onChange={(e) =>
            onCategoryFilterChange(
              e.target.value === "all" ? "all" : (e.target.value as Category)
            )
          }
          label="Category"
          options={categoryOptions}
        />
      </div>

      <div className={styles["filter-group"]}>
        <Select
          id="sortField"
          name="sortField"
          value={sortField}
          onChange={(e) => onSortFieldChange(e.target.value as SortField)}
          label="Sort Field"
          options={sortFieldOptions}
        />
      </div>

      <div className={styles["filter-group"]}>
        <Select
          id="sortOrder"
          name="sortOrder"
          value={sortOrder}
          onChange={(e) => onSortOrderChange(e.target.value as SortOrder)}
          label="Sort Order"
          options={sortOrderOptions}
        />
      </div>
    </div>
  );
};

export default PostFilters;
