import PostFilters from "../../components/post/PostFilters";
import Button from "../../components/ui/button/Button";
import styles from "./Post.module.scss";

const Post = () => {
  return (
    <div className={`${styles.container}`}>
      {"제목"}
      <div>
        <h1>Post</h1>
      </div>
      <div className={`${styles["post-wrapper"]}`}>
        <PostFilters />
        <div className={`${styles["button-box"]}`}>
          <Button>글작성</Button>
        </div>
        <div className={`${styles["post-box"]}`}>
          <table className={`${styles.table}`}>
            <thead>
              <tr>
                <th>No.</th>
                <th>Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Title</td>
                <td>category</td>
                <td>Author</td>
                <td>Time</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Post;
