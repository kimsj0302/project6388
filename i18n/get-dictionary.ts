import type { Locale } from "./config";
import { defaultLocale } from "./config";

import en from "./dictionaries/en.json";
import ko from "./dictionaries/ko.json";

export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = { en, ko };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}
