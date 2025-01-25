import { GameState } from "../gameReducer";

export enum CardRarityT {
  BASIC = "Basic",
  COMMON = "Common",
  UNCOMMON = "Uncommon",
  RARE = "Rare",
}

export enum CardTypeT {
  ACTION = "Action",
  PROGRAM = "Program",
  FILE = "File",
  AGENDA = "Agenda",
  HARDWARE = "Hardware",
  RESOURCE = "Resource",
  UPGRADE = "Upgrade",
  OPERATION = "Operation",
  ASSET = "Asset",
  IDENTITY = "Identity",
  EVENT = "Event",
  CONNECTION = "Connection",
  TRAP = "Trap",
  ICE = "ICE",
}

export enum CardKeywordT {
  UNPLAYABLE = "Unplayable",
  ETHEREAL = "Ethereal",
  CRASH = "Crash",
  TRASH = "Trash",
}

export type CardEffectT = {
  callback: (gameState: GameState) => GameState;
  description: {
    text: string;
    isKeyword?: true;
  };
};

export type CardSubroutineT = {
  callback: (gameState: GameState) => GameState;
  description: {
    text: string;
    isKeyword?: true;
  };
};

export type CardPropertiesT = {
  id: string;
  name: string;
  rarity: CardRarityT;
  type: CardTypeT;
  image: string;
  keywords?: CardKeywordT[];
  subroutines?: CardSubroutineT[];
  effects?: CardEffectT[];
};

export type PlayingCardT = CardPropertiesT & {
  deckContextId: string;
};
