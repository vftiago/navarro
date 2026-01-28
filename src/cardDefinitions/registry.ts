/**
 * Card Registry - Type-safe card identifiers
 *
 * This enum provides compile-time safety for card references.
 * Use CardId instead of string names when referencing cards.
 */

// Agenda cards
export const AgendaCardId = {
  CORPORATE_SECRETS: "corporate_secrets",
  SIGNAL_BROADCAST: "signal_broadcast",
} as const;

// Ice cards
export const IceCardId = {
  BAD_MOON: "bad_moon",
  BIOMETRIC_AUTHENTICATOR: "biometric_authenticator",
  FIRE_WALL: "fire_wall",
  ICE_WALL: "ice_wall",
  WALL_OF_STATIC: "wall_of_static",
} as const;

// Program cards
export const ProgramCardId = {
  DEEP_THOUGHTS: "deep_thoughts",
  INTRUSIVE_THOUGHTS: "intrusive_thoughts",
  RUNNING_SNEAKERS: "running_sneakers",
  SLEDGEHAMMER: "sledgehammer",
} as const;

// Script cards
export const ScriptCardId = {
  BOOST_ENERGY_ULTRA: "boost_energy_ultra",
  CRACK: "crack",
  FLUSH: "flush",
  FOCUS: "focus",
  PIECE_OF_CAKE: "piece_of_cake",
  RUN: "run",
} as const;

// Trap/Server cards
export const TrapCardId = {
  JUNK: "junk",
  SCINTILLATING_SCOTOMA: "scintillating_scotoma",
  SERVER_LOCKDOWN: "server_lockdown",
} as const;

// Combined CardId object for convenience
export const CardId = {
  ...AgendaCardId,
  ...IceCardId,
  ...ProgramCardId,
  ...ScriptCardId,
  ...TrapCardId,
} as const;

// Type for any card ID
export type CardId = (typeof CardId)[keyof typeof CardId];

// Category-specific types
export type AgendaCardId = (typeof AgendaCardId)[keyof typeof AgendaCardId];
export type IceCardId = (typeof IceCardId)[keyof typeof IceCardId];
export type ProgramCardId = (typeof ProgramCardId)[keyof typeof ProgramCardId];
export type ScriptCardId = (typeof ScriptCardId)[keyof typeof ScriptCardId];
export type TrapCardId = (typeof TrapCardId)[keyof typeof TrapCardId];

// Player card IDs (programs + scripts)
export type PlayerCardId = ProgramCardId | ScriptCardId;

// Server card IDs (agendas + ice + traps)
export type ServerCardId = AgendaCardId | IceCardId | TrapCardId;
