import styles from "./App.module.scss";
import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";

function App() {
  return (
    <div className={`${styles["app"]}`}>
      <Navbar />
      <div className={`${styles["outlet"]}`}>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
