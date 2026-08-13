import type { Game } from "./types";

type GameEntry = Omit<Game, "downloads"> & {
  downloads?: Game["downloads"];
};

type GamesDataFile = {
  commonDownloads: Game["downloads"];
  games: GameEntry[];
};

export function normalizeGames(input: unknown): Game[] {
  if (Array.isArray(input)) {
    return input as Game[];
  }

  const data = input as Partial<GamesDataFile>;
  if (!data.games || !Array.isArray(data.games) || !data.commonDownloads) {
    return [];
  }

  return data.games.map((game) => ({
    ...game,
    downloads: game.downloads ?? data.commonDownloads!,
  })) as Game[];
}

export function getCatalogNumber(index: number): string {
  return `6388${String(index + 1).padStart(3, "0")}`;
}
