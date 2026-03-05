import type { Game } from "./types";

export function getRulebookUrl(game: Game): string {
  return `https://github.com/${game.repo}/releases/latest/download/${game.downloads.rulebook_asset}`;
}

export function getPnpUrl(game: Game): string {
  return `https://github.com/${game.repo}/releases/latest/download/${game.downloads.pnp_asset}`;
}

export function getRepoUrl(game: Game): string {
  return `https://github.com/${game.repo}`;
}
