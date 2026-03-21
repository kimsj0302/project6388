import type { Locale } from "@/i18n/config";
import { defaultLocale } from "@/i18n/config";

export type GameStatus = "prototype" | "playtest" | "stable";

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
   * - key: Locale (en, ko, ...)
   * - value: 각 언어 규칙서 파일명 (예: rulebook_en.pdf)
   * - 최소 en 1개는 항상 존재해야 함
   */
  rulebooks?: Partial<Record<Locale, string>> & { en: string };
  pnp_asset: string;
}

export interface Game {
  code: string;
  title: LocalizedString;
  status: GameStatus;
  version?: string;
  summary: LocalizedString;
  repo: string;
  image?: string;
  downloads: GameDownloads;
}

export function localize(field: LocalizedString, locale: Locale): string {
  return field[locale] ?? field[defaultLocale];
}
