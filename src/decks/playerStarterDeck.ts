import type { PlayerCardId } from "../cards/ids";
import { CardId } from "../cards/ids";
import type { CardInstance } from "../cards/instance";
import { createCardInstance } from "../cards/instance";

/**
 * Player starter deck definition using type-safe CardId references
 *
 * Each entry is { id, count } for clarity and to avoid repetition
 */
const deckList: { count: number; id: PlayerCardId }[] = [
  { count: 6, id: CardId.RUN },
  { count: 3, id: CardId.FOCUS },
  { count: 1, id: CardId.RUNNING_SNEAKERS },
  { count: 1, id: CardId.BOOST_ENERGY_ULTRA },
  { count: 1, id: CardId.PIECE_OF_CAKE },
  { count: 1, id: CardId.SLEDGEHAMMER },
  { count: 1, id: CardId.INTRUSIVE_THOUGHTS },
];

export const playerStarterDeck: CardInstance[] = deckList.flatMap(
  ({ count, id }) =>
    Array.from({ length: count }, () => createCardInstance(id)),
);
