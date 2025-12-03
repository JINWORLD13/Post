import { useState, useRef, useEffect } from "react";
import styles from "./PostTable.module.scss";
import { type Post } from "../../../types/post";
import Button from "../../ui/button/Button";
import useAuth from "../../../hooks/useAuth";

interface PostTableProps {
  posts: Post[];
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
  onTitleClick?: (post: Post) => void;
}

interface ColumnConfig {
  key: string;
  label: string;
  width: number;
  visible: boolean;
}

const PostTable = ({
  posts,
  onEdit,
  onDelete,
  onTitleClick,
}: PostTableProps) => {
  const { user } = useAuth();
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: "no", label: "번호", width: 80, visible: true },
    { key: "title", label: "제목", width: 500, visible: true },
    { key: "category", label: "카테고리", width: 120, visible: true },
    { key: "tags", label: "태그", width: 150, visible: true },
    { key: "author", label: "작성자", width: 120, visible: true },
    { key: "date", label: "날짜", width: 150, visible: true },
    { key: "actions", label: "작업", width: 150, visible: true },
  ]);

  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const tableRef = useRef<HTMLTableElement>(null);

  // 컬럼 넓이 조절 시작
  const handleResizeStart = (e: React.MouseEvent, columnKey: string) => {
    e.preventDefault();
    const column = columns.find((col) => col.key === columnKey);
    if (column) {
      setResizingColumn(columnKey);
      setStartX(e.clientX);
      setStartWidth(column.width);
    }
  };

  // 컬럼 넓이 조절 중
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (resizingColumn) {
        const diff = e.clientX - startX;
        const newWidth = Math.max(50, startWidth + diff); // 최소 50px

        setColumns((prevColumns) =>
          prevColumns.map((col) =>
            col.key === resizingColumn ? { ...col, width: newWidth } : col
          )
        );
      }
    };

    const handleMouseUp = () => {
      setResizingColumn(null);
    };

    if (resizingColumn) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizingColumn, startX, startWidth]);

  // 컬럼 표시/숨김 토글
  const toggleColumnVisibility = (columnKey: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.key === columnKey ? { ...col, visible: !col.visible } : col
      )
    );
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const visibleColumns = columns.filter((col) => col.visible);

  return (
    <div className={styles["post-table-container"]}>
      {/* 컬럼 표시/숨김 컨트롤 */}
      <div className={styles["column-controls"]}>
        <h3>컬럼 표시/숨김</h3>
        <div className={styles["column-checkboxes"]}>
          {columns.map((column) => (
            <label key={column.key} className={styles["column-checkbox"]}>
              <input
                type="checkbox"
                checked={column.visible}
                onChange={() => toggleColumnVisibility(column.key)}
              />
              <span>{column.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles["post-table-box"]}>
        <table ref={tableRef} className={styles.table}>
          <thead>
            <tr>
              {visibleColumns.map((column) => (
                <th
                  key={column.key}
                  style={{ width: `${column.width}px`, position: "relative" }}
                >
                  {column.label}
                  {column.key !== "actions" && (
                    <div
                      className={styles["resize-handle"]}
                      onMouseDown={(e) => handleResizeStart(e, column.key)}
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length}
                  className={styles["empty-cell"]}
                >
                  게시글이 없습니다.
                </td>
              </tr>
            ) : (
              posts.map((post, index) => (
                <tr key={post.id}>
                  {columns.find((col) => col.key === "no")?.visible && (
                    <td>{index + 1}</td>
                  )}
                  {columns.find((col) => col.key === "title")?.visible && (
                    <td>
                      {onTitleClick ? (
                        <span
                          className={styles["title-link"]}
                          onClick={() => onTitleClick(post)}
                        >
                          {post.title}
                        </span>
                      ) : (
                        post.title
                      )}
                    </td>
                  )}
                  {columns.find((col) => col.key === "category")?.visible && (
                    <td>{post.category}</td>
                  )}
                  {columns.find((col) => col.key === "tags")?.visible && (
                    <td>{post.tags.join(", ") || "-"}</td>
                  )}
                  {columns.find((col) => col.key === "author")?.visible && (
                    <td>{post.email || user?.email || post.userId}</td>
                  )}
                  {columns.find((col) => col.key === "date")?.visible && (
                    <td>{formatDate(post.createdAt)}</td>
                  )}
                  {columns.find((col) => col.key === "actions")?.visible && (
                    <td>
                      <div className={styles["action-buttons"]}>
                        <Button
                          className={styles["edit-button"]}
                          onClick={() => onEdit(post)}
                        >
                          수정
                        </Button>
                        <Button
                          className={styles["delete-button"]}
                          onClick={() => onDelete(post.id)}
                        >
                          삭제
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PostTable;
