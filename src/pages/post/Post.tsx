import Button from "../../components/ui/Button/Button";
import styles from "./Post.module.scss";

const Post = () => {
  return (
    <div className={`${styles.container}`}>
      <div>Post</div>
      <div className={`${styles['table-wrapper']}`}>
        <div className={`${styles['button-box']}`}><Button>글작성</Button></div>
        <div className={`${styles['table-box']}`}>
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
