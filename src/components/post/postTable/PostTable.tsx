import styles from "./PostTable.module.scss";

const PostTable = () => {
  return (
    <div className={`${styles["post-table-box"]}`}>
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
  );
};

export default PostTable;
