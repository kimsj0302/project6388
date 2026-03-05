"use client";

import { useState } from "react";
import type { Game, GameStatus } from "@/lib/types";
import { localize } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import {
  getRulebookLinks,
  getPnpUrl,
  getRepoUrl,
  type RulebookLink,
} from "@/lib/downloads";
import type { Dictionary } from "@/i18n/get-dictionary";

type GamesDict = Dictionary["games"];

function StatusBadge({ status }: { status: GameStatus }) {
  return <span className={`badge badge-${status}`}>{status}</span>;
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
          <a
            href={getRepoUrl(game)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            GitHub
          </a>
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

  const filterOptions: { key: string; label: string }[] = [
    { key: "all", label: dict.filterAll },
    { key: "prototype", label: dict.filterPrototype },
    { key: "playtest", label: dict.filterPlaytest },
    { key: "stable", label: dict.filterStable },
  ];

  const filtered =
    filter === "all" ? games : games.filter((g) => g.status === filter);

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
