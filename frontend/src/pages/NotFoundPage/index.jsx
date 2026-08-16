import React from "react";
import { Link } from "react-router-dom";
import Container from "../../components/Container";
import Button from "../../components/Button";
import styles from "./index.module.scss";

function NotFoundPage() {
  return (
    <Container className={styles.wrapper}>
      <span className={styles.code}>404</span>
      <h1 className={styles.title}>Bu rəf boş görünür.</h1>
      <p className={styles.text}>Axtardığınız səhifə tapılmadı və ya köçürülüb.</p>
      <Link to="/">
        <Button variant="primary">Ana səhifəyə qayıt</Button>
      </Link>
    </Container>
  );
}

export default NotFoundPage;
