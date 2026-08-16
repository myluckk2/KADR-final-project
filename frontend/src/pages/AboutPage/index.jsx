import React from "react";
import Container from "../../components/Container";
import SectionTitle from "../../components/SectionTitle";
import styles from "./index.module.scss";

const VALUES = [
  {
    number: "01",
    title: "Kitab da, kart da bir rəfdə",
    text: "Kitablar və video dərslər eyni kataloq məntiqi ilə bir yerdə saxlanılır — axtardığın hər şey əl çatan məsafədədir.",
  },
  {
    number: "02",
    title: "Bir kliklə yadda saxla",
    text: "Kartın küncündəki möhürə bas, kifayətdir. Sistem onu avtomatik olaraq şəxsi rəfinə (wishlist) yerləşdirir.",
  },
  {
    number: "03",
    title: "Sadə, aydın idarəetmə",
    text: "Admin yeni məzmun əlavə edir, sən isə rahatca kəşf edib özünə uyğun olanları seçirsən.",
  },
];

function AboutPage() {
  return (
    <Container className={styles.wrapper}>
      <section className={styles.intro}>
        <span className={styles.eyebrow}>Haqqımızda</span>
        <h1 className={styles.title}>
          Rəf — oxumaq və izləmək istədiyin hər şeyin toplandığı kiçik bir kataloq.
        </h1>
        <p className={styles.lead}>
          Rəf, kitab və video-kartları bir kataloq kitabxanası kimi təqdim edən
          fullstack tədris layihəsidir. Məqsəd sadədir: gəz, bəyən, möhürlə,
          rəfinə qoy.
        </p>
      </section>

      <section>
        <SectionTitle eyebrow="Prinsiplərimiz" title="Nəyə görə Rəf?" />
        <div className={styles.grid}>
          {VALUES.map((v) => (
            <article key={v.number} className={styles.card}>
              <span className={styles.number}>{v.number}</span>
              <h3 className={styles.cardTitle}>{v.title}</h3>
              <p className={styles.cardText}>{v.text}</p>
            </article>
          ))}
        </div>
      </section>
    </Container>
  );
}

export default AboutPage;
