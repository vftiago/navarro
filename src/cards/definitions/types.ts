import type { EffectSpec } from "../engine/effects";
/**
 * Card Definition Types - Pure data, no functions
 *
 * A card definition lists properties (name, image, rarity, effects,
 * keywords); all behavior lives in the engine, referenced by id via
 * `EffectSpec`. Definitions are serializable by construction.
 */
import type {
  CardRarity,
  CardType,
  IceSubtype,
  Keyword,
  ProgramSubtype,
} from "../enums";
import type {
  AgendaCardId,
  CardId,
  IceCardId,
  ProgramCardId,
  ScriptCardId,
  TrapCardId,
} from "../ids";

/**
 * What the player pays to activate an ability. Costs are paid in full,
 * up front, before the effects resolve — an unpayable cost blocks
 * activation entirely (unlike effects, which resolve as much as possible).
 */
export type AbilityCost = {
  /** Turn clicks consumed (omitted = 0) */
  clicks?: number;
  /** The card trashes itself as part of the cost (fires ON_TRASH) */
  trashSelf?: boolean;
};

/**
 * A player-activated ability: "cost: effects", e.g.
 * "Click, Trash: Draw 3 cards." Activation is structural — an ability is
 * activated because it lives in `abilities`, not because it has a cost.
 */
export type ActivatedAbility = {
  cost: AbilityCost;
  effects: EffectSpec[];
};

export type BaseCardDefinition = {
  effects: EffectSpec[];
  flavorText?: string;
  id: CardId;
  image: string;
  keywords?: Keyword[];
  name: string;
  rarity: CardRarity;
  /** Replaces the generated effect text lines (keyword lines always render) */
  text?: string;
};

export type IceCardDefinition = BaseCardDefinition & {
  damage: number;
  id: IceCardId;
  /** Base strength; modifier effects (e.g. strength_per_server_security) add to it */
  strength: number;
  subtype: IceSubtype;
  type: CardType.ICE;
};

export type ProgramCardDefinition = BaseCardDefinition & {
  /** Player-activated abilities, usable while the program is installed */
  abilities?: ActivatedAbility[];
  id: ProgramCardId;
  subtype: ProgramSubtype;
  type: CardType.PROGRAM;
};

export type AgendaCardDefinition = BaseCardDefinition & {
  id: AgendaCardId;
  type: CardType.AGENDA;
  victoryPoints: number;
};

/** Scripts, files, traps — cards with no extra stats beyond the base */
export type GenericCardDefinition = BaseCardDefinition & {
  id: ScriptCardId | TrapCardId;
  type: Exclude<CardType, CardType.AGENDA | CardType.ICE | CardType.PROGRAM>;
};

export type CardDefinition =
  | AgendaCardDefinition
  | GenericCardDefinition
  | IceCardDefinition
  | ProgramCardDefinition;
