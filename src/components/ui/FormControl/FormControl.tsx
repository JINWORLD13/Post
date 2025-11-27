import React from "react";
import styles from "./FormControl.module.scss";
interface FormControlProps {
  className?: string;
  inputDataClassName?: string;
  children: React.ReactNode;
}

const FormControl: React.FC<FormControlProps> = ({
  className,
  inputDataClassName,
  children,
}) => {
  return (
    <div className={`${styles.container} ${className || ""}`}>
      <div className={styles["input-data"]}>
        {inputDataClassName ? (
          <div className={inputDataClassName}>{children}</div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default FormControl;
