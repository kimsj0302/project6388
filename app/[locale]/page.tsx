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

      <hr className="divider" />

      <section className="about-section">
        <h2>{t.designer.heading}</h2>
        <p>{t.designer.name}</p>
        <p className="about-designer-links">
          <a
            href="https://github.com/kimsj0302"
            target="_blank"
            rel="noopener noreferrer"
            className="about-designer-link"
            aria-label="GitHub profile: Soongjin Kim"
          >
            <svg
              className="about-designer-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
          <a
            href="mailto:kimsj0302@gmail.com"
            className="about-designer-link about-designer-link-mail"
            aria-label="Email: kimsj0302@gmail.com"
          >
            <svg
              className="about-designer-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
            <span className="about-designer-email">kimsj0302@gmail.com</span>
          </a>
        </p>
      </section>
    </>
  );
}
