import type { Game } from "./types";
import type { Locale } from "@/i18n/config";
import { defaultLocale, isValidLocale } from "@/i18n/config";

export interface RulebookLink {
  locale: Locale;
  url: string;
}

export function getRulebookLinks(game: Game): RulebookLink[] {
  const downloads = game.downloads;

  // 새 구조: 언어별 rulebooks 우선
  if (downloads.rulebooks) {
    return Object.entries(downloads.rulebooks)
      .filter(
        (entry): entry is [Locale, string] =>
          isValidLocale(entry[0]) && Boolean(entry[1])
      )
      .map(([locale, filename]) => ({
        locale,
        url: `https://github.com/${game.repo}/releases/latest/download/${filename}`,
      }));
  }

  // 구 구조: 단일 rulebook_asset만 있는 경우
  if (downloads.rulebook_asset) {
    return [
      {
        locale: defaultLocale,
        url: `https://github.com/${game.repo}/releases/latest/download/${downloads.rulebook_asset}`,
      },
    ];
  }

  return [];
}

export function getPnpUrl(game: Game): string {
  return `https://github.com/${game.repo}/releases/latest/download/${game.downloads.pnp_asset}`;
}

export function getRepoUrl(game: Game): string {
  return `https://github.com/${game.repo}`;
}
