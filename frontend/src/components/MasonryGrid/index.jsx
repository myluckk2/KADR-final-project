import React from "react";
import styles from "./index.module.scss";

/**
 * CSS `columns` əsaslı Pinterest-tipli waterfall grid.
 * Uşaq elementlər (Card) `break-inside: avoid` ilə sütun daxilində bölünmür.
 */
function MasonryGrid({ children }) {
  return <div className={styles.grid}>{children}</div>;
}

export default MasonryGrid;
