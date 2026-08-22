# Design Document: The Map System

_Status: exploratory (2026-08-18). Nothing here is implemented; this captures a design conversation so we can iterate on it. Open questions are marked as such._

## Vision

A Slay the Spire-style map layer, reimagined for cyberspace: the player dives ever
deeper into a server (or some corner of cyberspace) looking for treasure and dealing
with danger. Nodes are "encounters"; depth means escalating risk and reward. The
original sketch: each node is a single face-down card the player can flip to decide
what's next — traps spring immediately, ICE blocks passage until dealt with (or
routed around), agendas are scored.

## The fork in the road (biggest open decision)

Two different games hide in that description:

- **(A) Map above runs** — StS-style macro map. Each node contains one of our
  _existing_ full encounters; the current game loop becomes the "combat" inside a
  map. Safe, proven, preserves everything built so far.
- **(B) Map as the run** — the grid replaces the linear `ENCOUNTERING_ICE` chain;
  the whole game is one continuous spatial dive.

**Current leaning: (B).** It is the more novel game and the one the "diving ever
deeper" fantasy actually describes — a statement about the moment-to-moment loop,
not a menu between fights. Architecturally, the run state machine generalizes
cleanly from "linear ice sequence" to "graph traversal": a run becomes a path,
encountering ice becomes entering a guarded node. (B) can still borrow (A)'s best
trick later — strata chokepoints _are_ act bosses.

## Infinite map: yes, but "infinite" is the wrong axis

Technically near-free: generate nodes lazily from a seeded hash of their
coordinates; store only revealed nodes in the map slice. The grid stays
deterministic, serializable, and unbounded without storing the unexplored part.

The real question is **what ends a run**. StS's map works because its shape creates
a goal gradient (visible boss, converging paths, act crescendo); an infinite open
grid has no gradient and risks aimless wandering. Fix it with forcing functions we
already have thematic hooks for:

- **Security escalation as doom clock.** Depth maps to security tiers: deeper =
  better loot, meaner ice. Structure the infinity as _strata_ — depth bands
  separated by descent chokepoints that act like act bosses. Infinite in principle;
  the game has acts again.
- **Noise as pursuit.** Noise becomes spatial: it attracts sentries, which move
  toward the player between turns. Sentries are not a new entity class — they are
  ice with the existing `IceSubtype.SENTRY`, unanchored (see "The ice subtype
  triangle" below). Whether anything moves on the map at all is an open question.
  Looting becomes push-your-luck — every flip makes noise, noise summons pressure,
  and the player decides when to jack out and bank what they've got (an extraction
  mechanic).

Principle: **infinite world, finite dive.** The player ends the game, or the corp
does — never the edge of the map.

## Avoiding the minesweeper trap (information design)

If every node is a uniform face-down card, flipping is gambling, not deciding.
Minesweeper avoids this with deduction; StS with full visibility. Pure blind flips
get neither.

- **Tiered visibility:** adjacent nodes show their _type_ (ice / data / trap-shaped
  / unknown); _contents_ stay hidden until entered. Routing becomes a real decision.
- Keep a deliberate **"?" node type** for genuine gambles (like StS event nodes).
- **Signal = scanning.** Signal becomes reveal radius/depth. Focus ("Gain 5
  signal") turns into a scouting card, and a dead stat becomes a build archetype.

### Topology: graph, not grid

On an open grid, "go around the ice" is always cheap, which makes ice toothless.
ICE only means something at a chokepoint. Generate a _graph_ that looks like a
subnet diagram — rooms, corridors, junctions, rendered as nodes on circuit-board
traces (more cyberspace-flavored than a grid anyway). The generator deliberately
places ice where it guards something.

### The ice subtype triangle gains spatial identity

The existing barrier / code gate / sentry triangle (`IceSubtype`) stops being
flavor and becomes three distinct map behaviors, each answered by its existing
breaker subtype:

| Ice subtype | Map behavior                                                  | Breaker |
| ----------- | ------------------------------------------------------------- | ------- |
| Barrier     | Static; blocks a chokepoint node until broken — the wall      | Fracter |
| Code Gate   | Static; gates passage with a condition or cost — the lock     | Decoder |
| Sentry      | Doesn't sit on a node: patrols, moves toward noise on corp turns; reaching the player starts an encounter wherever they stand — the hunt | Killer  |

Killers become anti-pursuit tech — what you bring when you plan to be loud. A
sentry reaching a player already engaged with other ice queues a second
encounter (the pincer). The one existing sentry card (`ice.ts`) would need
redesigning as a roamer, and sentries eventually need movement speed and aggro
range.

**Status: one idea under exploration, no commitment** — mobile entities of any
kind (ice included) are an open question, and this whole mapping only matters if
movement survives. If nothing moves, noise pressure needs a static form instead:
a rising trace counter, lockdown zones sealing nodes behind the player, or
security fields expanding outward from disturbed nodes — and the sentry subtype
would then express "the ice that punishes noise" in whatever form that takes.

## Encounters and rewards

The engine already speaks this language: flipping a node is ON_ACCESS, traps
springing on reveal is Netrunner's ambush flavor (ON_DISCARD / net damage path),
ice blocking a node is ON_ENCOUNTER, rezzing is ON_REZ.

Node taxonomy sketch:

| Node        | Behavior                                                                  |
| ----------- | ------------------------------------------------------------------------- |
| ICE         | Blocks a chokepoint until broken — the natural home for icebreaker work   |
| Trap        | Springs immediately on reveal                                             |
| Data/Agenda | The treasure — score or bank                                              |
| Cache/Shop  | Card rewards, credits, hardware                                           |
| Defrag      | Rest site: remove cards, repair                                           |
| Descent     | Chokepoint to the next stratum (act boss)                                 |
| "?"         | Event — a deliberate gamble                                               |

Rewards follow the roguelike-deckbuilder trinity — cards, currency, permanent
artifacts — with **hardware as the natural relic class**.

## Movement: basic actions floor, cards ceiling (decided)

Under fork (B), moving/diving _is_ the game — and the cardinal rule is **never
gate the core verb behind a draw**. A turn where shuffle luck means the player
cannot do the game's central activity is a non-turn. So:

- **Moving to an adjacent node is a basic click action** — always available,
  never card-dependent. This is Netrunner's own pattern: making a run is a basic
  action; run events (Stimhack, Dirty Laundry) make runs _better_, never
  _possible_.
- **Run-type cards become tempo and tech:** "Move 2 nodes," "Enter a node without
  revealing it," "Bypass the next ice this turn," "Jack out for free." The deck
  determines how _well_ you dive, never _whether_ you dive. The current BASIC
  `Run` card retires or becomes the vanilla tempo card.
- **Clicks are the universal currency** (play, activate, move). Depth-per-turn is
  bounded by the click budget, which is what gives between-turn corp pressure its
  teeth and makes movement-efficiency cards valuable rather than mandatory.
- Considered and rejected: Clank!-style card-gated movement. It works there only
  via a universal safety valve (every card yields movement). That patches a
  problem the click-action design never has.

A "no Run cards" turn is therefore not a failure state — just a baseline turn:
1 node per click.

### The all-movement turn is already priced

A player may legally spend every click moving and play nothing. This is a
legitimate posture (Netrunner's basic-actions-all-turn), and the existing End
phase already taxes it: **the hand is discarded at end of turn**, so a full
sprint burns everything drawn. No sprint-tax rule needed — only effect sizing: a
card must be worth more than the 1 move its click could have bought.

## Node resolution: entering is flipping (decided)

One universal verb: **moving into an unrevealed node _is_ the flip** — no
separate reveal action, no dealing with cards from an adjacent node. The
careful-player version ("flip before move") already exists as opt-in
**scanning**: spend signal to reveal contents from range. Reckless divers move
blind; scanner builds pay to know.

Entering an unrevealed node costs 1 click (spent regardless — the price of
moving blind), then by type:

- **Empty / dealt-with:** move through; nothing else.
- **Trap:** springs immediately on entry, resolves, node becomes empty.
- **Data / cache / agenda:** access resolves (existing ON_ACCESS → select
  flow); node becomes looted.
- **ICE:** the encounter starts at that node — the current `ENCOUNTERING_ICE`
  state pinned to a map position. While engaged the player cannot move onward.
  Options: break subroutines, click through (existing `clickIce`, eating
  unbroken subs), or **retreat** to the previous node for a click. Retreat keeps
  "go around" alive at a fair price (two clicks plus the information gained).

**Subroutines fire on the pass attempt, never on entry.** "End the run"
translates spatially to **bounce-back**: weak versions to the previous node,
brutal versions toward the entry point — lost ground instead of a binary door.
"Dealt-with" is not necessarily permanent: corp re-icing behind the player means
the cleared corridor may not stay cleared. Design space (rare, elite-tier): ice
with "cannot retreat" or an on-retreat sting — the spatial trap-ice.

## Encounters persist across turns (decided)

Entering ice on the last click does **not** force-feed the subroutines. The turn
ends with the player engaged; the corp turn happens while they stand there; next
turn they face the ice with a full click budget. The cost of engaging on the
last click is **tempo, not damage** — one donated world-tick.

Why: the alternative is a gotcha rule whose only lesson is "never move into an
unknown node on your last click" (dead last clicks); the doom clock already
prices lost time; and it converts the edge case into a technique — deliberately
approaching on the last click to break-and-pass next turn with a full budget.
Combined with "no jack-out mid-encounter," engagement is a real commitment.

## Corp turn: the world tick (decided: once per player turn)

The phase skeleton survives — Corp → Draw → Upkeep → Main → End, with Main now
containing move/play/activate. The corp phase gains map duties; one tick:

- **Move the sentries** (if movement survives), at a speed scaled by noise —
  deterministic and visible on the map (StS intents, applied spatially: routing
  around a threat is a puzzle, never a lottery).
- **Escalate security** (+1; probably per-stratum once strata exist).
- **React to the breach:** rez face-down ice at chokepoints near the player, and
  re-ice nodes behind them — the corp repairing the path down is what makes the
  climb out a different game.
- **Advance the trace** when noise is above threshold; trace maxing = flatline.

**Cadence decided: once per player turn** — which yields the sprint dynamic: a
4-move turn gives the world 1 tick per 4 nodes covered, a card-heavy turn 1 tick
per node. Speed literally outruns the world, so discarding your hand to sprint
for the exit is dramatic _and_ mechanically correct. Considered and rejected:
corp ticks per _click_ (roguelike hunger clock) — it kills that dynamic and
punishes card play, since every card played would give the world a step.

## Jacking in and out: meatspace as a phase, not a place (decided)

Meatspace is not a second game world — it is a **screen**: the safehouse, with no
grid, no movement, no turns (Hades' hub is the model: the exhale between dives,
where permanence lives). The playable game is ~95% cyberspace, honoring the
"always jacked in" fantasy where it matters; the thin meatspace layer does four
jobs nothing else can: banking, pacing, hardware, deck editing. Dives become the
"acts" of the run: jack in → dive → extract → safehouse → jack in deeper.

### The extraction loop

- **Clean extraction requires reaching an exit node** — the entry point, or
  backdoor nodes discovered while diving (finding a new exit is itself a reward
  type). The climb out is a chase through a map the player has disturbed: ice
  rezzed behind them, sentries converging, noise at its peak. The way up is a
  different game from the way down.
- **Dumpshock** (the panic button): emergency jack-out from anywhere, at a brutal
  price — lose most unbanked loot and take brain damage (= cards destroyed).
- **Cannot jack out mid-encounter** (Netrunner's "not while engaged with ice"
  rule carries over).
- Three-tier exit: **clean exit** (keep everything) / **dumpshock** (keep your
  life, lose the haul) / **flatline** (trace or sentries catch you — harshest
  loss). The rising noise/trace curve is what forces the choice; every dive is
  self-limiting without an arbitrary timer.

### Hardware: found in cyberspace, installed in meatspace

You don't pick up a physical deck-mod inside a server — you steal its
_schematic_, the credits to buy it, or the black-market contact selling it. In
the safehouse that converts into a permanent rig upgrade (the relic slot).
**Cyberspace produces wealth and information; meatspace converts them into
permanent power.** Each layer does the one thing the other can't.

Fallback if we ever go zero-meatspace: reflavor as safe-haven nodes for banking
and hardware as wetware/resident daemons — viable, but gives up the hardware
fantasy, the pacing exhale, and the diegetic deck rule below.

### The deck is fully virtual

**In cyberspace the deck is executable; in meatspace it is editable.** During a
dive the deck is a running process — the player _is_ their deck: hand as working
memory, drawing as processing, damage deletes cards (brain damage as card
destruction — the flatline analogy). You cannot rewrite your own running mind
mid-dive, which is _why_ deck editing only happens jacked out: the standard
roguelike-deckbuilder restriction, made diegetic (editing source code vs.
patching a live process).

Jacked out, the deck is relevant as a _build_ object, never a _play_ object —
meatspace has no hands, no draws, no clicks. It is the only place in the game
where the player is not their deck.

## Open questions

- Confirm fork (A) vs (B) — leaning (B), not locked.
- Does anything move on the map? Sentries-as-mobile-ice is one candidate under
  exploration, nothing more; if movement is rejected, pick a static
  noise-pressure form (trace counter, lockdown, expanding security fields).
- The pincer: what exactly happens when a sentry reaches a player already
  engaged with other ice (second encounter queued? trace advances? sentry
  waits?) — only relevant if movement survives.
- Corp-turn tuning: sentry speed as a function of noise, re-icing rate, trace
  thresholds.
- Dumpshock specifics: how much unbanked loot is lost, how brain damage picks
  which cards to destroy, whether it is permanent.
- Backdoor/exit node generation: frequency, discoverability, one-use or
  persistent.
- How strata generation is tuned (band size, ice density, chokepoint frequency).
- State shape for the `map` slice and the node-reveal event flow (design before
  code).
