import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.scss";
import useAuth from "../../hooks/useAuth";

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    logout();
    navigate("/");
  };
  return (
    <div className={`${styles.navbar}`}>
      <div className={`${styles["logo"]}`}>Logo</div>
      <div className={`${styles["flex-gap"]}`} />
      <div className={`${styles["navbar-links"]}`}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ""}`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/post"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ""}`
          }
        >
          Post
        </NavLink>
        {isAuthenticated && (
          <NavLink
            to="/chart"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            Chart
          </NavLink>
        )}
        {isAuthenticated ? (
          <a href="#" onClick={handleLogout} className={styles.link}>
            Logout
          </a>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            Login
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Navbar;
