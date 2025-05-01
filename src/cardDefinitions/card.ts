import { ReactNode } from "react";
import { GameAction, GameState } from "../state/reducer";

export enum CardRarity {
  BASIC = "Basic",
  COMMON = "Common",
  UNCOMMON = "Uncommon",
  RARE = "Rare",
}

export enum CardType {
  SCRIPT = "Script", // the equivalent to instants or sorceries
  AGENDA = "Agenda", // these cards give the player victory points when scored
  PROGRAM = "Program", // the equivalent to permanents
  FILE = "File", // cards that don't do anything on their own
  ICE = "Ice", // the equivalent to enemy permanents
}

export enum CardSubtype {
  ACTION = "Action",
  COMMAND = "Command",
  OPERATION = "Operation",
  UPGRADE = "Upgrade",
  ASSET = "Asset",
  IDENTITY = "Identity",
  EVENT = "Event",
  RESOURCE = "Resource",
  HARDWARE = "Hardware",
  CONNECTION = "Connection",
  TRAP = "Trap",
  FILE = "File",
}

export enum IceSubtype {
  BARRIER = "Barrier",
  CODE_GATE = "Code Gate",
  SENTRY = "Sentry",
}

export enum ProgramSubtype {
  DECODER = "Decoder",
  FRACTER = "Fracter",
  KILLER = "Killer",
  AI = "AI",
}

export enum TriggerMoment {
  ON_ACCESS = "onAccess",
  ON_CLICK = "onClick",
  ON_DRAW = "onDraw",
  ON_TURN_START = "onTurnStart",
  ON_ENCOUNTER = "onEncounter",
  ON_REVEAL = "onReveal",
  ON_FETCH = "onFetch",
  ON_PLAY = "onPlay",
  ON_DISCARD = "onDiscard",
  ON_TRASH = "onTrash",
  ON_INSTALL = "onInstall",
  ON_REZ = "onRez",
}

export enum EffectCost {
  CLICK = "Click",
  TRASH = "Trash",
}

export enum Keyword {
  UNPLAYABLE = "Unplayable",
  ETHEREAL = "Ethereal",
  CRASH = "Crash",
  TRASH = "Trash",
}

export type CardEffect = {
  costs?: EffectCost[];
  keyword?: Keyword;
  triggerMoment: TriggerMoment;
  getActions: ({
    gameState,
    sourceId,
    targetId,
  }: {
    gameState: GameState;
    sourceId?: string;
    targetId?: string;
  }) => GameAction[];
  getText: () => ReactNode;
};

export type BaseCardDefinitions = {
  name: string;
  rarity: CardRarity;
  image: string;
  cardEffects: CardEffect[];
  flavorText?: string;
};

export type IceCardDefinitions = BaseCardDefinitions & {
  type: CardType.ICE;
  subtype: IceSubtype.BARRIER | IceSubtype.CODE_GATE | IceSubtype.SENTRY;
  isRezzed: boolean;
  damage: number;
  getStrength: (gameState: GameState) => number;
};

export type ProgramCardDefinitions = BaseCardDefinitions & {
  type: CardType.PROGRAM;
  subtype: ProgramSubtype;
};

export type AgendaCardDefinitions = BaseCardDefinitions & {
  type: CardType.AGENDA;
  victoryPoints: number;
};

export type ServerCardDefinitions = BaseCardDefinitions & {
  type: Exclude<CardType, CardType.ICE | CardType.AGENDA | CardType.PROGRAM>;
};

export type CardDefinitions =
  | ServerCardDefinitions
  | IceCardDefinitions
  | ProgramCardDefinitions
  | AgendaCardDefinitions;

type WithDeckContext<T> = T & { deckContextId: string };

export type ServerPlayingCard = WithDeckContext<ServerCardDefinitions>;
export type IcePlayingCard = WithDeckContext<IceCardDefinitions>;
export type ProgramPlayingCard = WithDeckContext<ProgramCardDefinitions>;
export type AgendaPlayingCard = WithDeckContext<AgendaCardDefinitions>;

export type PlayingCard =
  | ServerPlayingCard
  | IcePlayingCard
  | ProgramPlayingCard
  | AgendaPlayingCard;
