# Pending Choice — Mid-Effect Player Input

Goal: let an effect pause for player input ("discard a card, then…", "choose a
program to break with…") without giving up the two properties the architecture
now guarantees: **game state stays serializable** (no closures paused
mid-flight) and **the event vocabulary stays minimal** (a click gains meaning
from state; no new event types).

Design principle carried over from the card registry refactor: build the
mechanism through its **first real consumer** (a discard-cost card), shaped so
the icebreaker interaction lands on it later as a second `kind`.

---

## 1. Core idea

A choice is **data in game state**, and its continuation is **`EffectSpec[]`
— pure data**, not a suspended function:

```typescript
// src/state/turn/types.ts
export type PendingChoice = {
  kind: "discard_from_hand";   // discriminated union; extensible per interaction
  /** Instance whose effect requested the choice (context for logs/UI/effects) */
  sourceId: string;
  /** Effects to execute once the choice resolves — serializable continuation */
  followUp: EffectSpec[];
};

export type TurnState = {
  // ...existing fields
  pendingChoice: PendingChoice | null;
};
```

Lifecycle:

```
effect execution hits a choice primitive
  → store PendingChoice { kind, sourceId, followUp: <remaining specs> }, stop executing
  → game is locked until resolved (see §4)
  → player clicks a valid option (CARD_CLICKED — no new event type)
  → handler resolves: perform the choice's action, clear pendingChoice,
    execute followUp specs (which may themselves pause again — nesting is free)
```

Because `followUp` is `EffectSpec[]`, a pending choice survives
serialization: save/load/replay mid-choice works by construction.

## 2. Authoring model — the pause is implicit

A card lists its effects in reading order; everything **after** a choice
primitive becomes the continuation automatically:

```typescript
// "Discard a card from your hand. Draw 2 cards."
{
  id: CardId.MEMORY_PURGE,
  name: "Memory Purge",
  type: CardType.SCRIPT,
  rarity: CardRarity.COMMON,
  image: "memory_purge.jpg",
  effects: [
    { effect: "discard_from_hand" },
    { effect: "draw", params: { amount: 2 } },
  ],
}
```

No nested `then:` blocks, no recursive spec types; generated text stays flat
(one line per effect, as today).

## 3. Engine changes

- **New primitive** `discard_from_hand` (params: none for v1; a `count` can
  come later). Its implementation carries a marker instead of actions:
  `choiceKind: "discard_from_hand"` on `EffectImplementation`.
  `getText` → "Discard a card from your hand."
- **Executor pause** (`engine/execute.ts`): the spec-execution loop checks the
  marker; on hit it dispatches
  `setPendingChoice({ kind, sourceId, followUp: remainingSpecs })` and stops.
  A public `executeEffectSpecs(specs, dispatch, getState, ctx)` is used both
  by `executeTriggers` and by choice resolution (for `followUp`).
- **Shared discard choke point** (`src/state/utils`): extract
  `discardFromHand(handIndex, dispatch, getState)` from `dealNetDamage` —
  remove from hand → fire `ON_DISCARD` → add to discard pile. Both net damage
  and choice resolution call it; the ON_DISCARD design rule (only effect
  discards from hand trigger) is then enforced by a single function.

## 4. Event handling

`CARD_CLICKED` resolver gains a **top-priority branch** (before the
play/ice/access branches):

- `pendingChoice.kind === "discard_from_hand"` and the clicked instance is in
  hand → `discardFromHand(...)`, `clearPendingChoice()`, execute `followUp`
  with the original `sourceId`.
- Clicked instance is not a valid option → warn, ignore.

While a choice is pending, **the game is locked**: `PLAYER_END_TURN` and
`PLAYER_INITIATE_RUN` are rejected with a warning, and no other CARD_CLICKED
branch is reachable. (Phases may already have moved on — e.g. playPhase
finishes zone-routing and transitions to Main before the player resolves the
choice; that is fine and intended, the lock is what preserves correctness.)

Rules notes:

- **Unplayable does not block choosing.** Discarding is not playing — Junk is
  legal (and desirable) discard fodder. The choice branch performs no
  `unplayable` check; PlayerHand's cosmetic gating must also step aside while
  a choice is pending.
- **Forced, no cancel** in v1. An `optional: true` flag (click elsewhere /
  explicit skip) is a later extension — don't build it until a card wants it.

## 5. UI (v1 minimal)

- A prompt banner while `pendingChoice` is active (e.g. "Choose a card to
  discard"), styled like the access overlay's title but without blocking the
  hand.
- `PlayerHand`: when a choice is pending, clicks emit immediately (skip the
  play exit animation or reuse it — implementer's call), and the
  Main-phase/unplayable cosmetic gates are bypassed.
- Everything else (End turn button etc.) can stay visually enabled — the
  handler rejects it — but disabling is a nice-to-have.

## 6. First consumer

**Memory Purge** (Script, Common): "Discard a card from your hand. Draw 2
cards." — added to the player starter deck (count: 1) as the mechanism's
proof. Placeholder name/art; rename freely.

## 7. Future kinds (not built now)

| kind | Trigger context | Options | Resolution |
| --- | --- | --- | --- |
| `discard_from_hand` (v1) | any effect | cards in hand | discard + followUp |
| `break_subroutine` | during encounter | eligible installed programs | negate subroutine, cost, followUp |
| `choose_mode` | on play | one of N printed modes | execute chosen branch |
| `search_deck` | any effect | cards in deck | fetch + shuffle |

Each is a new union member on `PendingChoice`, a new resolver branch, and a
new primitive/marker — the mechanism itself doesn't change.

## 8. Decisions to confirm before implementing

1. **Empty hand**: "discard a card" with nothing to discard —
   **recommendation: skip the choice, still execute `followUp`** (effects do
   as much as they can; matches StS behavior). Alternative: drop the
   follow-up (strict cost semantics). This is a gameplay call.
2. **Where the state lives**: recommendation `turnState.pendingChoice` (it is
   flow control, like `runProgressState`). Alternative: its own slice.
3. **Choice during a run**: v1 consumers are Main-phase plays, but nothing
   forbids an ON_ENCOUNTER effect requesting a discard mid-run. The lock +
   resolver-priority design handles it; flagging so it's tested when it
   happens.

## 9. Implementation order

1. `discardFromHand` util extraction (+ `dealNetDamage` refactor) — no
   behavior change.
2. `pendingChoice` state in the turn slice (types/actions/reducer/selector).
3. Engine: `discard_from_hand` primitive + `choiceKind` marker + executor
   pause + public `executeEffectSpecs`.
4. Event handler: priority branch + lockout.
5. UI: prompt banner + PlayerHand gating awareness.
6. Memory Purge definition + deck entry.
7. Verify: tsc/lint/build + a driven browser session (play Memory Purge →
   click a hand card → hand shrinks by 2, then grows by 2 → game unlocked).
