import {
  CardRarity,
  CardType,
  TriggerMoment,
  ServerCardDefinitions,
} from "../card";
import { KEYWORD_EFFECTS } from "../keywords";
import {
  modifyClicks,
  setTurnCurrentPhase,
  TurnPhase,
} from "../../state/reducers/turnReducer";

export const trapCards: ServerCardDefinitions[] = [
  {
    name: "Junk",
    rarity: CardRarity.BASIC,
    type: CardType.FILE,
    image: "_2c63c6dc-7f51-4cac-9e6b-83be70b8909d.jpeg",
    cardEffects: [KEYWORD_EFFECTS.Unplayable, KEYWORD_EFFECTS.Ethereal],
  },
  {
    name: "Server Lockdown",
    image: "_3785e7cf-fe8c-4e05-905f-44f3a467aff3.jpeg",
    rarity: CardRarity.COMMON,
    type: CardType.SCRIPT,
    cardEffects: [
      {
        triggerMoment: TriggerMoment.ON_REVEAL,
        getActions: ({ gameState }) => {
          const serverSecurityLevel = gameState.serverState.serverSecurityLevel;
          return serverSecurityLevel >= 3
            ? [setTurnCurrentPhase(TurnPhase.Discard)]
            : [];
        },
        getText: () =>
          "If the server security level is 3 or more, end the run.",
      },
    ],
  },
  {
    name: "Scintillating Scotoma",
    image: "_60281fe6-4c0d-4b67-a6d4-28ab7754bf77.jpg",
    rarity: CardRarity.COMMON,
    type: CardType.SCRIPT,
    cardEffects: [
      {
        triggerMoment: TriggerMoment.ON_DRAW,
        getActions: () => [modifyClicks(-1)],
        getText: () => "When you draw this card, lose 1 tick.",
      },
      KEYWORD_EFFECTS.Unplayable,
      KEYWORD_EFFECTS.Ethereal,
    ],
  },
];
