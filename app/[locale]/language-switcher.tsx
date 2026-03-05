"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { locales, type Locale } from "@/i18n/config";

const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  ko: "KO",
};

export function LanguageSwitcher({
  currentLocale,
}: {
  currentLocale: Locale;
}) {
  const pathname = usePathname();

  function getLocalePath(targetLocale: Locale) {
    const segments = pathname.split("/");
    segments[1] = targetLocale;
    return segments.join("/");
  }

  return (
    <div className="lang-switcher" role="navigation" aria-label="Language">
      {locales.map((loc) => (
        <Link
          key={loc}
          href={getLocalePath(loc)}
          className="lang-btn"
          data-active={loc === currentLocale ? "true" : "false"}
          aria-current={loc === currentLocale ? "true" : undefined}
        >
          {LOCALE_LABELS[loc]}
        </Link>
      ))}
    </div>
  );
}
