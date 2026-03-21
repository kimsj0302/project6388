import type { Game } from "./types";

interface GithubReleaseResponse {
  tag_name?: string;
}

async function fetchLatestTag(repo: string): Promise<string | null> {
  const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
    headers: {
      Accept: "application/vnd.github+json",
    },
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as GithubReleaseResponse;
  return data.tag_name ?? null;
}

export async function hydrateLatestVersions(games: Game[]): Promise<Game[]> {
  const tags = await Promise.all(games.map((game) => fetchLatestTag(game.repo)));

  return games.map((game, index) => ({
    ...game,
    version: tags[index] ?? game.version ?? "",
  }));
}
