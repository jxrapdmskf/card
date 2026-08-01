import "./App.css";
import { useMemo, useState } from "react";
import Card from "./Components/Card";
import Dock from "./Components/Dock";
import Navbar from "./Components/Navbar";
import type { CardContent, GameData } from "./types/game";

const gameModules = import.meta.glob("./assets/games/*.json", {
  eager: true,
  import: "default",
});

function isCardContent(value: unknown): value is CardContent {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.name === "string" &&
    typeof candidate.description === "string"
  );
}

function isGameData(value: unknown): value is GameData {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.coverImage === "string" &&
    Array.isArray(candidate.cards) &&
    candidate.cards.every(isCardContent)
  );
}

export default function App() {
  const games = useMemo(() => {
    return Object.values(gameModules).reduce<GameData[]>(
      (accumulator, module) => {
        if (isGameData(module) && module.cards.length > 0) {
          accumulator.push(module);
        }

        return accumulator;
      },
      [],
    );
  }, []);

  const [selectedGameId, setSelectedGameId] = useState(games[0]?.id ?? "");
  const [activePage, setActivePage] = useState<"home" | "game">("home");

  const selectedGame = useMemo(() => {
    return games.find((game) => game.id === selectedGameId) ?? games[0];
  }, [games, selectedGameId]);

  const openGame = (gameId: string) => {
    setSelectedGameId(gameId);
    setActivePage("game");
  };

  const goToGame = () => {
    if (!selectedGame) {
      return;
    }

    setActivePage("game");
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-6 pb-24">
        {activePage === "home" ? (
          <section className="w-full max-w-6xl">
            <h1 className="mb-4 text-center text-2xl font-bold">เลือกเกม</h1>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {games.map((game) => (
                <button
                  key={game.id}
                  type="button"
                  onClick={() => openGame(game.id)}
                  className="group flex flex-col gap-2 text-left"
                >
                  <div className="card overflow-hidden rounded-xl shadow-sm transition group-hover:shadow-md">
                    <figure className="aspect-[5/7] w-full overflow-hidden">
                      <img
                        src={game.coverImage}
                        alt={game.title}
                        className="h-full w-full object-cover"
                      />
                    </figure>
                  </div>
                  <p className="text-center text-sm font-semibold">
                    {game.title}
                  </p>
                </button>
              ))}
            </div>
          </section>
        ) : selectedGame ? (
          <Card
            gameTitle={selectedGame.title}
            gameCoverImage={selectedGame.coverImage}
            items={selectedGame.cards}
          />
        ) : (
          <div className="text-sm opacity-70">ไม่พบข้อมูลเกม</div>
        )}
      </main>
      <Dock
        activePage={activePage}
        onHomeClick={() => setActivePage("home")}
        onGameClick={goToGame}
      />
    </div>
  );
}
