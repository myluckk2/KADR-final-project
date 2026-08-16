import React from "react";
import styles from "./index.module.scss";

function Loader({ label = "Yüklənir..." }) {
  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </div>
  );
}

export default Loader;
