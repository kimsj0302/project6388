import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale as Locale);
  return {
    title: `About — Project 6388`,
    description: dict.meta.aboutDescription,
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale as Locale);
  const t = dict.about;

  return (
    <>
      <section className="hero">
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </section>

      <section className="about-section">
        <h2>{t.whatIs.heading}</h2>
        <p>{t.whatIs.p1}</p>
        <p>{t.whatIs.p2}</p>
      </section>

      <hr className="divider" />

      <section className="about-section">
        <h2>{t.principles.heading}</h2>
        <ul>
          {t.principles.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      <hr className="divider" />

      <section className="about-section">
        <h2>{t.howItWorks.heading}</h2>
        <p>{t.howItWorks.p1}</p>
        <p>{t.howItWorks.p2}</p>
      </section>

      <hr className="divider" />

      <section className="about-section">
        <h2>{t.releaseCycle.heading}</h2>
        <ul>
          <li>
            <strong>Prototype</strong> — {t.releaseCycle.prototype.split(" — ")[1]}
          </li>
          <li>
            <strong>Playtest</strong> — {t.releaseCycle.playtest.split(" — ")[1]}
          </li>
          <li>
            <strong>Stable</strong> — {t.releaseCycle.stable.split(" — ")[1]}
          </li>
        </ul>
      </section>
    </>
  );
}
