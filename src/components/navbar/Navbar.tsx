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
      <div className={`${styles["logo"]}`}>
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles["logo-icon"]}
        >
          <rect width="32" height="32" rx="8" fill="url(#logoGradient)" />
          <path
            d="M16 8L20 14H24L18 20L20 26L16 22L12 26L14 20L8 14H12L16 8Z"
            fill="white"
          />
          <defs>
            <linearGradient id="logoGradient" x1="0" y1="0" x2="32" y2="32">
              <stop offset="0%" stopColor="#667eea" />
              <stop offset="100%" stopColor="#764ba2" />
            </linearGradient>
          </defs>
        </svg>
        <span className={styles["logo-text"]}>DataViz</span>
      </div>
      <div className={`${styles["flex-gap"]}`} />
      <div className={`${styles["navbar-links"]}`}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ""}`
          }
        >
          홈
        </NavLink>
        <NavLink
          to="/post"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ""}`
          }
        >
          게시글
        </NavLink>
        {isAuthenticated && (
          <NavLink
            to="/chart"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            차트
          </NavLink>
        )}
        {isAuthenticated ? (
          <a href="#" onClick={handleLogout} className={styles.link}>
            로그아웃
          </a>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            로그인
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Navbar;
