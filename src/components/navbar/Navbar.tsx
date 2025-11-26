import { Link } from "react-router-dom";
import styles from "./Navbar.module.scss";

const Navbar: React.FC = () => {
  return (
    <div className={`${styles.navbar}`}>
      <div className={`${styles["logo"]}`}>Logo</div>
      <div className={`${styles["flex-gap"]}`} />
      <div className={`${styles["navbar-links"]}`}>
        <Link to="/" className={styles.link}>
          Home
        </Link>
        <Link to="/post" className={styles.link}>
          Post
        </Link>
        <Link to="/chart" className={styles.link}>
          Chart
        </Link>
        <Link to="/login" className={styles.link}>
          Login
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
