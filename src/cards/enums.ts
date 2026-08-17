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
  RESOURCE = "Resource",
}

export enum TriggerMoment {
  ON_ACCESS = "onAccess",
  ON_CLICK = "onClick",
  ON_DISCARD = "onDiscard",
  ON_DRAW = "onDraw",
  ON_ENCOUNTER = "onEncounter",
  ON_FETCH = "onFetch",
  ON_INSTALL = "onInstall",
  ON_PLAY = "onPlay",
  ON_REZ = "onRez",
  ON_RUN_END = "onRunEnd",
  ON_RUN_START = "onRunStart",
  ON_TRASH = "onTrash",
  ON_UPKEEP = "onUpkeep",
}

export enum EffectCost {
  CLICK = "Click",
  TRASH = "Trash",
}

export enum Keyword {
  UNPLAYABLE = "Unplayable",
  ETHEREAL = "Ethereal",
  TRASH = "Trash",
  STEALTHY = "Stealthy",
}
