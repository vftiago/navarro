import { v4 as uuid } from "uuid";
import { CardRarity, CardPropertiesT, CardType, TriggerMoment } from "./card";
import { KEYWORD_EFFECTS } from "./keywords";
import { GameState } from "../state/gameReducer";

export const serverCards: CardPropertiesT[] = [
  {
    id: uuid(),
    name: "Junk",
    rarity: CardRarity.BASIC,
    type: CardType.FILE,
    image: "_2c63c6dc-7f51-4cac-9e6b-83be70b8909d.jpeg",
    cardEffects: [KEYWORD_EFFECTS.Unplayable, KEYWORD_EFFECTS.Ethereal],
  },
  {
    id: uuid(),
    name: "Server Lockdown",
    image: "_3785e7cf-fe8c-4e05-905f-44f3a467aff3.jpeg",
    rarity: CardRarity.COMMON,
    type: CardType.EVENT,
    cardEffects: [
      {
        triggerMoment: TriggerMoment.ON_REVEAL,
        callback: (gameState) => gameState,
        getText: () =>
          "If the server security level is 3 or more, end the run.",
      },
    ],
  },
  {
    id: uuid(),
    name: "Signal Broadcast",
    image: "_0b628974-25c9-4bc4-8eb0-ff8ed115b720.jpeg",
    rarity: CardRarity.COMMON,
    type: CardType.AGENDA,
    victoryPoints: 1,
    cardEffects: [
      {
        triggerMoment: TriggerMoment.ON_FETCH,
        callback: (gameState) => {
          return {
            ...gameState,
            player: {
              ...gameState.player,
              tags: gameState.player.tags + 1,
            },
          };
        },
        getText: () => "When you fetch this card, get 1 tag.",
      },
      {
        triggerMoment: TriggerMoment.ON_FETCH,
        callback: (gameState) => {
          return {
            ...gameState,
            player: {
              ...gameState.player,
              victoryPoints: gameState.player.victoryPoints + 2,
            },
          };
        },
        getText: () => "Score 2.",
      },
    ],
  },
  {
    id: uuid(),
    name: "Corporate Secrets",
    image: "_0bdf6635-5355-45f7-9c9c-8fc0773a4f1d.jpeg",
    rarity: CardRarity.COMMON,
    type: CardType.AGENDA,
    victoryPoints: 1,
    cardEffects: [
      {
        triggerMoment: TriggerMoment.ON_FETCH,
        callback: (gameState) => {
          return {
            ...gameState,
            player: {
              ...gameState.player,
              victoryPoints: gameState.player.victoryPoints + 1,
            },
          };
        },
        getText: () => "Score 1.",
      },
    ],
  },
  {
    id: uuid(),
    name: "Scintillating Scotoma",
    image: "_60281fe6-4c0d-4b67-a6d4-28ab7754bf77.jpg",
    rarity: CardRarity.COMMON,
    type: CardType.TRAP,
    cardEffects: [
      {
        triggerMoment: TriggerMoment.ON_DRAW,
        callback: (gameState: GameState) => {
          return {
            ...gameState,
            tick: gameState.tick - 1,
          };
        },
        getText: () => "When you draw this card, lose 1 tick.",
      },
    ],
  },
];
