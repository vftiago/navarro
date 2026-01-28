import { createPlayerCardById } from "../cardDefinitions/createPlayingCard";
import type { PlayerCardId } from "../cardDefinitions/registry";
import { CardId } from "../cardDefinitions/registry";

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

export const playerStarterDeck = deckList.flatMap(({ count, id }) =>
  Array.from({ length: count }, () => createPlayerCardById(id)),
);
