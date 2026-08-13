"use client";

import { useEffect, useState } from "react";
import type { Game, GameStatus } from "@/lib/types";
import { localize } from "@/lib/types";
import { getCatalogNumber } from "@/lib/games";
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

function StatusLabel({ status }: { status: GameStatus }) {
  return <span className={`status-label status-label-${status}`}>{status}</span>;
}

function compactSpec(value: string): string {
  return value.replace(/~/g, "-").replace(/\s*min$/i, "");
}

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
          aria-label={`${dict.downloadRulebook} ${link.locale.toUpperCase()}`}
        >
          {link.locale.toUpperCase()}
        </a>
      ))}
    </>
  );
}

function GameCard({
  game,
  index,
  locale,
  dict,
}: {
  game: Game;
  index: number;
  locale: Locale;
  dict: GamesDict;
}) {
  const title = localize(game.title, locale);
  const summary = localize(game.summary, locale);
  const rulebookLinks = getRulebookLinks(game);
  const cardInfoUrl = getCardInfoUrl(game);

  return (
    <article className="game-card">
      <div className="game-card-body">
        <div className="game-card-top">
          <p className="catalogue-number">{getCatalogNumber(index)}</p>
          <p className="game-codename">{game.code}</p>
        </div>
        <div>
          <h3>{title}</h3>
          <p className="game-state">
            <StatusLabel status={game.status} />
            {game.version && <span>{game.version}</span>}
          </p>
        </div>
        {game.specs && (
          <dl className="game-specs" aria-label="Game information">
            <div className="game-spec">
              <dt>PLAYERS</dt>
              <dd>{compactSpec(game.specs.players)}</dd>
            </div>
            <div className="game-spec">
              <dt>TIME</dt>
              <dd>{compactSpec(game.specs.playTime)} MIN</dd>
            </div>
            <div className="game-spec">
              <dt>AGE</dt>
              <dd>{compactSpec(game.specs.age)}</dd>
            </div>
          </dl>
        )}
        <p className="game-summary">{summary}</p>
        <div className="game-actions">
          <div className="game-action-row">
            <span className="game-action-label">{dict.downloadRulebook}</span>
            <span className="game-action-links">
              <RulebookButtons links={rulebookLinks} dict={dict} />
            </span>
          </div>
          <div className="game-action-row">
            <span className="game-action-label">{dict.downloadPnp}</span>
            <span className="game-action-links">
              <a
                href={getPnpUrl(game)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                PDF
              </a>
            </span>
          </div>
          {cardInfoUrl && (
            <div className="game-action-row">
              <span className="game-action-label">Card Info</span>
              <span className="game-action-links">
                <a
                  href={cardInfoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  PNG
                </a>
              </span>
            </div>
          )}
        </div>
      </div>
      {game.image && (
        <div className="game-card-image">
          <img src={game.image} alt={title} />
        </div>
      )}
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
            <GameCard
              key={game.code}
              game={game}
              index={games.findIndex((item) => item.code === game.code)}
              locale={locale}
              dict={dict}
            />
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
