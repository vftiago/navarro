import { ReactNode } from "react";
import { GameState } from "../gameReducer";

export enum CardRarity {
  BASIC = "Basic",
  COMMON = "Common",
  UNCOMMON = "Uncommon",
  RARE = "Rare",
}

export enum CardType {
  ACTION = "Action",
  PROGRAM = "Program",
  SCRIPT = "Script",
  COMMAND = "Command",
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

export enum CardSubtype {
  BARRIER = "Barrier",
  CODE_GATE = "Code Gate",
  SENTRY = "Sentry",
  TRACER = "Tracer",
  DESTROYER = "Destroyer",
  AP = "AP",
  DECOY = "Decoy",
  DECRYPTOR = "Decryptor",
  ENCRYPTOR = "Encryptor",
}

export enum TriggerMoment {
  ON_ACCESS = "onAccess",
  ON_DRAW = "onDraw",
  ON_TURN_START = "onTurnStart",
  ON_REVEAL = "onReveal",
  ON_FETCH = "onFetch",
  ON_PLAY = "onPlay",
  ON_DISCARD = "onDiscard",
  ON_TRASH = "onTrash",
  ON_INSTALL = "onInstall",
  PERMANENT = "permanent",
}

export enum Keyword {
  UNPLAYABLE = "Unplayable",
  ETHEREAL = "Ethereal",
  CRASH = "Crash",
  TRASH = "Trash",
}

export type CardEffectT = {
  cost?: number;
  keyword?: Keyword;
  referencedKeywords?: Keyword[];
  triggerMoment: TriggerMoment;
  callback: (gameState: GameState) => GameState;
  getText: () => ReactNode;
};

export type BaseCardPropertiesT = {
  id: string;
  name: string;
  rarity: CardRarity;
  image: string;
  cardEffects: CardEffectT[];
  flavorText?: string;
};

export type ICECardPropertiesT = BaseCardPropertiesT & {
  type: CardType.ICE;
  subtype: CardSubtype.BARRIER | CardSubtype.CODE_GATE | CardSubtype.SENTRY;
  rezzed: boolean;
  getStrength: (gameState: GameState) => number;
};

export type AgendaCardPropertiesT = BaseCardPropertiesT & {
  type: CardType.AGENDA;
  victoryPoints: number;
};

export type DefaultCardPropertiesT = BaseCardPropertiesT & {
  type: Exclude<CardType, CardType.ICE | CardType.AGENDA>;
};

export type CardPropertiesT =
  | DefaultCardPropertiesT
  | ICECardPropertiesT
  | AgendaCardPropertiesT;

export type PlayingCardT = CardPropertiesT & {
  deckContextId: string;
};
