import React from "react";
import styles from "./index.module.scss";

/**
 * Ümumi, dəyişməyən Button komponenti.
 * variant: "primary" | "outline" | "ghost" | "danger"
 * size: "md" | "sm"
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  fullWidth = false,
  onClick,
  className = "",
  ...rest
}) {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} disabled={disabled} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}

export default Button;
