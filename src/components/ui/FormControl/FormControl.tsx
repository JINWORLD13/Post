import React from "react";
import styles from "./FormControl.module.scss";

const FormControl = (props: React.PropsWithChildren<{ className?: string }>) => {
  return (
    <div className={`${styles.container}`}>
      <div className={`${styles["input-data"]}`}>{props.children}</div>
    </div>
  );                                                
};

export default FormControl;
