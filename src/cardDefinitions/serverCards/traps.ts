import { modifyClicks, setTurnCurrentPhase, TurnPhase } from "../../state/turn";
import {
  CardRarity,
  CardType,
  TriggerMoment,
  ServerCardDefinitions,
} from "../card";
import { KEYWORD_EFFECTS } from "../keywords";

export const trapCards: ServerCardDefinitions[] = [
  {
    cardEffects: [KEYWORD_EFFECTS.Unplayable, KEYWORD_EFFECTS.Ethereal],
    image: "_2c63c6dc-7f51-4cac-9e6b-83be70b8909d.jpeg",
    name: "Junk",
    rarity: CardRarity.BASIC,
    type: CardType.FILE,
  },
  {
    cardEffects: [
      {
        getActions: ({ gameState }) => {
          const serverSecurityLevel = gameState.serverState.serverSecurityLevel;
          return serverSecurityLevel >= 3
            ? [setTurnCurrentPhase(TurnPhase.Discard)]
            : [];
        },
        getText: () =>
          "On Reveal, if the server security level is 3 or more, end the run.",
        triggerMoment: TriggerMoment.ON_REVEAL,
      },
    ],
    image: "_3785e7cf-fe8c-4e05-905f-44f3a467aff3.jpeg",
    name: "Server Lockdown",
    rarity: CardRarity.COMMON,
    type: CardType.SCRIPT,
  },
  {
    cardEffects: [
      {
        getActions: () => [modifyClicks(-1)],
        getText: () => "On Draw, lose 1 tick.",
        triggerMoment: TriggerMoment.ON_DRAW,
      },
      KEYWORD_EFFECTS.Unplayable,
      KEYWORD_EFFECTS.Ethereal,
    ],
    image: "_60281fe6-4c0d-4b67-a6d4-28ab7754bf77.jpg",
    name: "Scintillating Scotoma",
    rarity: CardRarity.COMMON,
    type: CardType.SCRIPT,
  },
];
