import type { Game, RulebookLocale } from "./types";
import { isValidRulebookLocale } from "./types";
import { defaultLocale } from "@/i18n/config";

export interface RulebookLink {
  locale: RulebookLocale;
  url: string;
}

export function getRulebookLinks(game: Game): RulebookLink[] {
  const downloads = game.downloads;

  // 새 구조: 언어별 rulebooks 우선
  if (downloads.rulebooks) {
    return Object.entries(downloads.rulebooks)
      .filter(
        (entry): entry is [RulebookLocale, string] =>
          isValidRulebookLocale(entry[0]) && Boolean(entry[1])
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

export function getCardInfoUrl(game: Game): string | null {
  if (!game.downloads.card_info_asset) {
    return null;
  }

  return `https://github.com/${game.repo}/releases/download/${game.version}/${game.downloads.card_info_asset}`;
}

export function getRepoUrl(game: Game): string {
  return `https://github.com/${game.repo}`;
}
