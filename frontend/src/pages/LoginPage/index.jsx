import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Container from "../../components/Container";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";
import styles from "./index.module.scss";

function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (mode === "login") {
        await login(username, password);
      } else {
        await register(username, password);
      }
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Əməliyyat uğursuz oldu. Məlumatları yoxlayın.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className={styles.wrapper}>
      <div className={styles.card}>
        <span className={styles.eyebrow}>Rəf hesabı</span>
        <h1 className={styles.title}>{mode === "login" ? "Giriş et" : "Qeydiyyatdan keç"}</h1>

        <div className={styles.tabs}>
          <button
            type="button"
            className={[styles.tab, mode === "login" ? styles.tabActive : ""].join(" ")}
            onClick={() => setMode("login")}
          >
            Giriş
          </button>
          <button
            type="button"
            className={[styles.tab, mode === "register" ? styles.tabActive : ""].join(" ")}
            onClick={() => setMode("register")}
          >
            Qeydiyyat
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>Username</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              required
              autoComplete="username"
            />
          </label>

          <label className={styles.field}>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <Button type="submit" variant="primary" fullWidth disabled={submitting}>
            {submitting ? "Göndərilir..." : mode === "login" ? "Giriş et" : "Qeydiyyatdan keç"}
          </Button>
        </form>

        <p className={styles.hint}>
          Demo üçün: <strong>admin / Admin123!</strong> (admin) və ya{" "}
          <strong>testuser / User1234!</strong> (user) — backend seed-i işə salındıqdan sonra.
        </p>
      </div>
    </Container>
  );
}

export default LoginPage;
