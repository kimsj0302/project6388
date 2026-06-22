"use client";

import { useEffect, useState } from "react";
import type { Game, GameStatus } from "@/lib/types";
import { localize } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import {
  getCardInfoUrl,
  getRulebookLinks,
  getPnpUrl,
  type RulebookLink,
} from "@/lib/downloads";
import type { Dictionary } from "@/i18n/get-dictionary";

type GamesDict = Dictionary["games"];

interface GitHubLatestRelease {
  tag_name?: string;
}

function StatusBadge({ status }: { status: GameStatus }) {
  return <span className={`badge badge-${status}`}>{status}</span>;
}

const specItems = [
  { key: "players", icon: "/images/game-specs/players.png", label: "Players" },
  { key: "playTime", icon: "/images/game-specs/play-time.png", label: "Play time" },
  { key: "age", icon: "/images/game-specs/age.png", label: "Age" },
] as const;

function RulebookButtons({
  links,
  dict,
}: {
  links: RulebookLink[];
  dict: GamesDict;
}) {
  if (links.length === 0) return null;

  return (
    <>
      {links.map((link) => (
        <a
          key={link.locale}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          <span className="btn-icon" aria-hidden="true">
            ↓
          </span>
          {dict.downloadRulebook}
          <span className="btn-locale" aria-hidden="true">
            {link.locale.toUpperCase()}
          </span>
        </a>
      ))}
    </>
  );
}

function GameCard({
  game,
  locale,
  dict,
}: {
  game: Game;
  locale: Locale;
  dict: GamesDict;
}) {
  const title = localize(game.title, locale);
  const summary = localize(game.summary, locale);
  const rulebookLinks = getRulebookLinks(game);
  const cardInfoUrl = getCardInfoUrl(game);

  return (
    <article className="game-card">
      {game.image && (
        <div className="game-card-image">
          <img src={game.image} alt={title} />
        </div>
      )}
      <div className="game-card-body">
        <div className="game-card-top">
          <h3>{title}</h3>
          <StatusBadge status={game.status} />
        </div>
        <span className="game-version">{game.version}</span>
        {game.specs && (
          <dl className="game-specs" aria-label="Game information">
            {specItems.map(({ key, icon, label }) => (
              <div className="game-spec" key={key}>
                <dt>
                  <img src={icon} alt="" aria-hidden="true" />
                  <span className="sr-only">{label}</span>
                </dt>
                <dd>{game.specs?.[key]}</dd>
              </div>
            ))}
          </dl>
        )}
        <p className="game-summary">{summary}</p>
        <p className="game-codename">
          {dict.codename}: {game.code}
        </p>
        <div className="game-actions">
          <RulebookButtons links={rulebookLinks} dict={dict} />
          <a
            href={getPnpUrl(game)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <span className="btn-icon" aria-hidden="true">
              ↓
            </span>
            {dict.downloadPnp}
          </a>
          {cardInfoUrl && (
            <a
              href={cardInfoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              <span className="btn-icon" aria-hidden="true">
                ↓
              </span>
              Card Info
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function GamesClient({
  games,
  locale,
  dict,
}: {
  games: Game[];
  locale: Locale;
  dict: GamesDict;
}) {
  const [filter, setFilter] = useState<string>("all");
  const [versionedGames, setVersionedGames] = useState<Game[]>(games);

  useEffect(() => {
    const controller = new AbortController();

    async function refreshLatestVersions() {
      const nextGames = await Promise.all(
        games.map(async (game) => {
          try {
            const response = await fetch(
              `https://api.github.com/repos/${game.repo}/releases/latest`,
              {
                headers: {
                  Accept: "application/vnd.github+json",
                  "X-GitHub-Api-Version": "2022-11-28",
                },
                signal: controller.signal,
              }
            );

            if (!response.ok) return game;

            const release = (await response.json()) as GitHubLatestRelease;
            return release.tag_name ? { ...game, version: release.tag_name } : game;
          } catch {
            return game;
          }
        })
      );

      if (!controller.signal.aborted) {
        setVersionedGames(nextGames);
      }
    }

    setVersionedGames(games);
    refreshLatestVersions();

    return () => controller.abort();
  }, [games]);

  const filterOptions: { key: string; label: string }[] = [
    { key: "all", label: dict.filterAll },
    { key: "prototype", label: dict.filterPrototype },
    { key: "playtest", label: dict.filterPlaytest },
    { key: "stable", label: dict.filterStable },
  ];

  const filtered =
    filter === "all"
      ? versionedGames
      : versionedGames.filter((g) => g.status === filter);

  return (
    <>
      <div className="filter-bar" role="group" aria-label={dict.filterLabel}>
        {filterOptions.map(({ key, label }) => (
          <button
            key={key}
            className="filter-btn"
            data-active={filter === key ? "true" : "false"}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="games-grid">
          {filtered.map((game) => (
            <GameCard key={game.code} game={game} locale={locale} dict={dict} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>{dict.emptyState}</p>
        </div>
      )}
    </>
  );
}
