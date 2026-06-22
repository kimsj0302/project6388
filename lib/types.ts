import type { Locale } from "@/i18n/config";
import { defaultLocale } from "@/i18n/config";

export type GameStatus = "prototype" | "playtest" | "stable";

export const rulebookLocales = ["en", "ko", "jp"] as const;

export type RulebookLocale = (typeof rulebookLocales)[number];

export type LocalizedString = Partial<Record<Locale, string>> & {
  en: string;
};

export interface GameDownloads {
  /**
   * 옛 구조: 단일 규칙서 파일명 (예: rulebook.pdf)
   * 새 구조: rulebooks 사용 권장
   */
  rulebook_asset?: string;
  /**
   * 새 구조: 언어별 규칙서 파일명
   * - key: RulebookLocale (en, ko, jp, ...)
   * - value: 각 언어 규칙서 파일명 (예: rulebook_en.pdf)
   * - 최소 en 1개는 항상 존재해야 함
   */
  rulebooks?: Partial<Record<RulebookLocale, string>> & { en: string };
  card_info_asset?: string;
  pnp_asset: string;
}

export interface GameSpecs {
  players: string;
  playTime: string;
  age: string;
}

export interface Game {
  code: string;
  title: LocalizedString;
  status: GameStatus;
  version?: string;
  summary: LocalizedString;
  repo: string;
  image?: string;
  specs?: GameSpecs;
  downloads: GameDownloads;
}

export function localize(field: LocalizedString, locale: Locale): string {
  return field[locale] ?? field[defaultLocale];
}

export function isValidRulebookLocale(value: string): value is RulebookLocale {
  return (rulebookLocales as readonly string[]).includes(value);
}
