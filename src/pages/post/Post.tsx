import PostFilters from "../../components/post/postfilters/PostFilters";
import PostTable from "../../components/post/postTable/PostTable";
import styles from "./Post.module.scss";
import Button from "../../components/ui/Button/Button";
import Modal from "../../components/ui/modal/Modal";
const Post = () => {
  return (
    <div className={`${styles.container}`}>
      {/* 제목 */}
      <div>
        <h1>Post</h1>
      </div>
      <div className={`${styles["post-wrapper"]}`}>
        {/* 필터 */}
        <PostFilters
          searchQuery={""}
          onSearchChange={() => {}}
          sortField={"title"}
          onSortFieldChange={() => {}}
          sortOrder={"asc"}
          onSortOrderChange={() => {}}
          categoryFilter={"all"}
          onCategoryFilterChange={() => {}}
        />
        {/* 글작성 버튼 */}
        <div className={`${styles["button-box"]}`}>
          <Button onClick={() => {}}>글작성</Button>
        </div>
        {/* 게시글 테이블 */}
        <PostTable />
        <Modal ></Modal>
      </div>
    </div>
  );
};

export default Post;
