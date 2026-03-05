import type { Locale } from "@/i18n/config";
import { defaultLocale } from "@/i18n/config";

export type GameStatus = "prototype" | "playtest" | "stable";

export type LocalizedString = Partial<Record<Locale, string>> & {
  en: string;
};

export interface GameDownloads {
  rulebook_asset: string;
  pnp_asset: string;
}

export interface Game {
  code: string;
  title: LocalizedString;
  status: GameStatus;
  version: string;
  summary: LocalizedString;
  repo: string;
  image?: string;
  downloads: GameDownloads;
}

export function localize(field: LocalizedString, locale: Locale): string {
  return field[locale] ?? field[defaultLocale];
}
