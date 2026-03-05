export const defaultLocale = "en" as const;

export const locales = ["en", "ko"] as const;

export type Locale = (typeof locales)[number];

export function isValidLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
