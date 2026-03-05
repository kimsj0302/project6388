import type { Metadata } from "next";
import type { Game } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import gamesData from "@/data/games.json";
import { getDictionary } from "@/i18n/get-dictionary";
import { GamesClient } from "./games-client";

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
  const games = gamesData as Game[];

  return (
    <>
      <div className="games-header">
        <h1>{dict.games.title}</h1>
        <p>{dict.games.subtitle}</p>
      </div>

      <GamesClient games={games} locale={locale as Locale} dict={dict.games} />
    </>
  );
}
