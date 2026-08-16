import React from "react";
import styles from "./index.module.scss";

function Container({ children, className = "" }) {
  return <div className={[styles.container, className].filter(Boolean).join(" ")}>{children}</div>;
}

export default Container;
