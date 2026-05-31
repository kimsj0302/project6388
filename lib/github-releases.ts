import type { Game } from "./types";

interface GitHubLatestRelease {
  tag_name?: string;
}

async function getLatestReleaseTag(repo: string): Promise<string | null> {
  const response = await fetch(
    `https://api.github.com/repos/${repo}/releases/latest`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  if (!response.ok) {
    return null;
  }

  const release = (await response.json()) as GitHubLatestRelease;
  return release.tag_name ?? null;
}

export async function withLatestReleaseVersions(games: Game[]): Promise<Game[]> {
  const entries = await Promise.all(
    games.map(async (game) => {
      try {
        const version = await getLatestReleaseTag(game.repo);
        return version ? { ...game, version } : game;
      } catch {
        return game;
      }
    })
  );

  return entries;
}
