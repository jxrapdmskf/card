import { useMemo, useState } from "react";
import type { CardContent, CardProps } from "../types/game";

const defaultCard: CardContent = {
  name: "ชื่อ",
  description: "คำอธิบาย",
  coverImage: "https://img.daisyui.com/images/stock/card-1.webp?x",
};

export default function Card({ gameTitle, gameCoverImage, items }: CardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipCount, setFlipCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  const currentCard = useMemo(() => {
    if (items.length === 0) {
      return defaultCard;
    }

    return items[currentIndex] ?? defaultCard;
  }, [items, currentIndex]);

  const getNextRandomIndex = () => {
    if (items.length <= 1) {
      return currentIndex;
    }

    let nextIndex = currentIndex;
    while (nextIndex === currentIndex) {
      nextIndex = Math.floor(Math.random() * items.length);
    }

    return nextIndex;
  };

  const handleCardClick = () => {
    if (isFlipping) {
      return;
    }

    const nextIndex = getNextRandomIndex();
    setCurrentIndex(nextIndex);
    setHasStarted(true);
    setIsFlipping(true);
    setFlipCount((prevFlipCount) => prevFlipCount + 1);
  };

  const handleFlipTransitionEnd: React.TransitionEventHandler<
    HTMLDivElement
  > = (event) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (event.propertyName !== "transform") {
      return;
    }

    setIsFlipping(false);
  };

  const cardName = currentCard.name;
  const cardDescription = currentCard.description;
  const cardCoverImage =
    currentCard.coverImage ??
    gameCoverImage ??
    "https://img.daisyui.com/images/stock/card-1.webp?x";

  const rotationDeg = flipCount * 180;

  const panelBaseClass =
    "absolute inset-x-3 bottom-3 z-10 h-28 overflow-hidden rounded-xl bg-gray-600/50 p-4 text-white backdrop-blur-sm";

  const flipDurationMs = 700;
  const flipStyle = {
    transform: `rotateY(${rotationDeg}deg)`,
    transitionDuration: `${flipDurationMs}ms`,
  };

  const mediaStyle = {
    transform: `rotateY(${-rotationDeg}deg)`,
    transitionDuration: `${flipDurationMs}ms`,
  };

  const panelStyle = {
    transform: `rotateY(${-rotationDeg}deg)`,
    transitionDuration: `${flipDurationMs}ms`,
  };

  const shouldShowIntro = !hasStarted;
  const shouldShowRandomText = hasStarted && !isFlipping;

  return (
    <button
      type="button"
      onClick={handleCardClick}
      className="group relative w-full max-w-[18rem] aspect-[5/7] cursor-pointer [perspective:1000px]"
      aria-label="flip card"
    >
      <div
        onTransitionEnd={handleFlipTransitionEnd}
        style={flipStyle}
        className="relative h-full w-full rounded-2xl shadow-sm transition-transform [transform-style:preserve-3d] [transform-origin:center_center] group-hover:shadow-lg"
      >
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <figure
            style={mediaStyle}
            className="h-full w-full transition-transform"
          >
            <img
              className="h-full w-full object-cover"
              src={cardCoverImage}
              alt="Card front"
            />
          </figure>

          {shouldShowIntro ? (
            <div
              style={panelStyle}
              className={`card-body ${panelBaseClass} transition-transform`}
            >
              <h2 className="card-title text-white">
                {gameTitle || "ชื่อเกม"}
              </h2>
              <p className="text-white/90">แตะเพื่อสุ่ม</p>
            </div>
          ) : shouldShowRandomText ? (
            <div
              style={panelStyle}
              className={`card-body ${panelBaseClass} transition-transform`}
            >
              <h2 className="card-title">{cardName}</h2>
              <p className="text-white/90">{cardDescription}</p>
            </div>
          ) : (
            <div
              style={panelStyle}
              className={`${panelBaseClass} transition-transform`}
            ></div>
          )}
        </div>
      </div>
    </button>
  );
}
