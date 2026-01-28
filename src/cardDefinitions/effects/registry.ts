/**
 * Effect Registry - Type-safe effect identifiers
 *
 * Each effect has a unique ID that maps to an implementation.
 * Effects are organized by category for clarity.
 */

// Common effects - simple resource modifications
export const CommonEffectId = {
  DRAW_CARDS_1: "draw_cards_1",
  DRAW_CARDS_3: "draw_cards_3",
  GAIN_CLICKS_1: "gain_clicks_1",
  GAIN_CLICKS_3: "gain_clicks_3",
  GAIN_SIGNAL_5: "gain_signal_5",
  GAIN_TAG_1: "gain_tag_1",
  GAIN_VICTORY_POINTS_2: "gain_victory_points_2",
  GAIN_VICTORY_POINTS_3: "gain_victory_points_3",
  LOSE_CLICKS_1: "lose_clicks_1",
  REDUCE_SERVER_SECURITY_1: "reduce_server_security_1",
} as const;

// Ice effects
export const IceEffectId = {
  BAD_MOON_BUFF_OTHER_ICE: "bad_moon_buff_other_ice",
  END_RUN: "end_run",
  FIRE_WALL_DYNAMIC_STRENGTH: "fire_wall_dynamic_strength",
  FIRE_WALL_NET_DAMAGE: "fire_wall_net_damage",
} as const;

// Program effects
export const ProgramEffectId = {
  DEEP_THOUGHTS_EXTRA_DRAW: "deep_thoughts_extra_draw",
  INTRUSIVE_THOUGHTS_UPKEEP: "intrusive_thoughts_upkeep",
  RUNNING_SNEAKERS_ON_RUN_END: "running_sneakers_on_run_end",
  SLEDGEHAMMER_BREAK_BARRIER: "sledgehammer_break_barrier",
} as const;

// Script effects
export const ScriptEffectId = {
  INITIATE_RUN: "initiate_run",
} as const;

// Trap/Server effects
export const TrapEffectId = {
  SERVER_LOCKDOWN_CONDITIONAL_END: "server_lockdown_conditional_end",
} as const;

// Combined EffectId object
export const EffectId = {
  ...CommonEffectId,
  ...IceEffectId,
  ...ProgramEffectId,
  ...ScriptEffectId,
  ...TrapEffectId,
} as const;

// Type for any effect ID
export type EffectId = (typeof EffectId)[keyof typeof EffectId];

// Category-specific types
export type CommonEffectId =
  (typeof CommonEffectId)[keyof typeof CommonEffectId];
export type IceEffectId = (typeof IceEffectId)[keyof typeof IceEffectId];
export type ProgramEffectId =
  (typeof ProgramEffectId)[keyof typeof ProgramEffectId];
export type ScriptEffectId =
  (typeof ScriptEffectId)[keyof typeof ScriptEffectId];
export type TrapEffectId = (typeof TrapEffectId)[keyof typeof TrapEffectId];
