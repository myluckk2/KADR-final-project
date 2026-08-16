import React from "react";
import styles from "./index.module.scss";

function EmptyState({ title, description, actionSlot }) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.mark} aria-hidden="true">
        ✦
      </span>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {actionSlot && <div className={styles.action}>{actionSlot}</div>}
    </div>
  );
}

export default EmptyState;
