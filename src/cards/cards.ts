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
}

export type CardEffectsT = {
  callback?: (gameState: GameState) => void;
  description: {
    text: string;
    isKeyword?: true;
  };
}[];

export type CardBaseT = {
  id: string;
  name: string;
  rarity: CardRarityT;
  type: CardTypeT;
  image: string;
  effects: CardEffectsT;
};

export type CardStateT = {
  isRevealed?: boolean;
};

export type CardT = CardBaseT &
  CardStateT & {
    deckContextId: string;
  };
