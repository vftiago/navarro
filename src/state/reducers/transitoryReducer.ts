import {
  GameAction,
  ADD_TO_ACCESSED_CARDS,
  CLEAR_ACCESSED_CARDS,
  ACCESS_PHASE,
  FETCH_PHASE,
  TransitoryState,
} from "../types";
import { drawRandomServerCard } from "../utils/cardUtils";

export const initialTransitoryState: TransitoryState = {
  transitoryAccessedCards: [],
  transitoryPlayedCards: [],
};

export const transitoryReducer = (
  state: TransitoryState = initialTransitoryState,
  action: GameAction,
): TransitoryState => {
  switch (action.type) {
    case ACCESS_PHASE: {
      const newCard = drawRandomServerCard();

      return {
        ...state,
        transitoryAccessedCards: [...state.transitoryAccessedCards, newCard],
      };
    }

    case ADD_TO_ACCESSED_CARDS:
      return {
        ...state,
        transitoryAccessedCards: [
          ...state.transitoryAccessedCards,
          ...action.payload.cards,
        ],
      };

    case FETCH_PHASE:
    case CLEAR_ACCESSED_CARDS:
      return {
        ...state,
        transitoryAccessedCards: [],
      };

    default:
      return state;
  }
};
