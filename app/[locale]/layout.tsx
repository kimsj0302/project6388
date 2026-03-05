import type { Metadata } from "next";
import Link from "next/link";
import { locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { LanguageSwitcher } from "./language-switcher";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale as Locale);
  return {
    title: "Project 6388",
    description: dict.meta.siteDescription,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale as Locale);

  return (
    <html lang={locale}>
      <body>
        <nav className="nav">
          <div className="nav-inner">
            <Link href={`/${locale}`} className="nav-logo">
              Project 6388
            </Link>
            <div className="nav-right">
              <ul className="nav-links">
                <li>
                  <Link href={`/${locale}`}>{dict.nav.about}</Link>
                </li>
                <li>
                  <Link href={`/${locale}/games`}>{dict.nav.games}</Link>
                </li>
              </ul>
              <LanguageSwitcher currentLocale={locale as Locale} />
            </div>
          </div>
        </nav>

        <main className="main">{children}</main>

        <footer className="footer">
          <p>
            &copy; {new Date().getFullYear()} {dict.footer.copyright}
          </p>
        </footer>
      </body>
    </html>
  );
}
