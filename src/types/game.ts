export type CardContent = {
  name: string;
  description: string;
  coverImage?: string;
};

export type GameData = {
  id: string;
  title: string;
  coverImage: string;
  cards: CardContent[];
};

export type CardProps = {
  gameTitle: string;
  gameCoverImage: string;
  items: CardContent[];
};
