import React from "react";
import styles from "./FormControl.module.scss";
interface FormControlProps {
  className?: string;
  inputDataClassName?: string;
}

const FormControl = ({ className, inputDataClassName, ...props }: React.FC<FormControlProps>) => {
  return (
    <div className={`${styles.container} ${className || ""}`}>
      <div className={`${styles["input-data"]} ${inputDataClassName || ""}`}>{props?.children}</div>
    </div>
  );
};

export default FormControl;
