import { Link } from "react-router-dom";
import styles from "./Navbar.module.scss";
import useAuth from "../../hooks/useAuth";

const Navbar: React.FC = () => {
  const { isAuthenticated } = useAuth();
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
        {isAuthenticated && (
          <Link to="/chart" className={styles.link}>
            Chart
          </Link>
        )}
        {isAuthenticated ? (
          <Link to="/logout" className={styles.link}>
            Logout
          </Link>
        ) : (
          <Link to="/login" className={styles.link}>
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
