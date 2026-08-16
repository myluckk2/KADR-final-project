import React, { useState } from "react";
import SectionTitle from "../../components/SectionTitle";
import Container from "../../components/Container";
import Button from "../../components/Button";
import { contactService } from "../../services/contactService";
import styles from "./index.module.scss";

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await contactService.send(form);
      setSent(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      const message =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        "Mesaj göndərilmədi. Bir az sonra yenidən cəhd edin.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className={styles.wrapper}>
      <SectionTitle
        eyebrow="Əlaqə"
        title="Bizimlə əlaqə saxla"
        description="Təklif, sual və ya rəy — hər zaman məmnuniyyətlə qarşılayırıq."
      />

      <div className={styles.layout}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>Ad Soyad</span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Adınızı daxil edin"
            />
          </label>

          <label className={styles.field}>
            <span>E-poçt</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="siz@nümunə.com"
            />
          </label>

          <label className={styles.field}>
            <span>Mesaj</span>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              required
              placeholder="Mesajınızı buraya yazın..."
            />
          </label>

          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Göndərilir..." : "Mesajı göndər"}
          </Button>

          {error && <p className={styles.error}>{error}</p>}
          {sent && <p className={styles.success}>Mesajınız üçün təşəkkürlər — tezliklə əlaqə saxlayacağıq.</p>}
        </form>

        <aside className={styles.infoCard}>
          <h3>Ünvan qeydiyyatı</h3>
          <ul>
            <li>
              <span className={styles.label}>E-poçt</span>
              <span>info@ref-katalog.az</span>
            </li>
            <li>
              <span className={styles.label}>Telefon</span>
              <span>+994 12 000 00 00</span>
            </li>
            <li>
              <span className={styles.label}>Şəhər</span>
              <span>Bakı, Azərbaycan</span>
            </li>
          </ul>
        </aside>
      </div>
    </Container>
  );
}

export default ContactPage;
