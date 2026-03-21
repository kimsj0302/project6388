import type { Metadata } from "next";
import type { Game } from "@/lib/types";
import { locales, type Locale } from "@/i18n/config";
import gamesData from "@/data/games.json";
import { getDictionary } from "@/i18n/get-dictionary";
import { hydrateLatestVersions } from "@/lib/github-releases";
import { GamesClient } from "./games-client";

type GameEntry = Omit<Game, "downloads"> & {
  downloads?: Game["downloads"];
};

type GamesDataFile = {
  commonDownloads: Game["downloads"];
  games: GameEntry[];
};

function normalizeGames(input: unknown): Game[] {
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

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale as Locale);
  return {
    title: `Games — Project 6388`,
    description: dict.meta.gamesDescription,
  };
}

export default async function GamesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale as Locale);
  const mergedGames = normalizeGames(gamesData);
  const games = await hydrateLatestVersions(mergedGames);

  return (
    <>
      <div className="games-header">
        <h1>{dict.games.title}</h1>
        <p>{dict.games.subtitle}</p>
      </div>

      <GamesClient games={games} locale={locale as Locale} dict={dict.games} />

      <div className="feedback-banner">
        <p>{dict.games.feedbackMessage}</p>
        <a
          href="https://FEEDBACK_FORM_URL"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          {dict.games.feedbackLink}
        </a>
      </div>
    </>
  );
}
