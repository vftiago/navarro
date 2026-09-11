# Design Document Mark II: The Dig

_Status: exploratory (2026-09-10). Nothing here is implemented. This captures a
design conversation about drastically simplifying the game and restoring its
conspiracy flavor. It supersedes the direction of `DESIGN_DOCUMENT.md` (Mark I,
the map system), which is kept for reference. Items are marked **decided**,
**leaning**, **rejected**, or **open**._

## Why a Mark II

Two original intentions got lost along the way:

1. **A very simple, minimal core ruleset.** The shipped loop (draw, spend
   clicks, run, access, discard) is still simple. The bloat crept in around it.
2. **Conspiracy flavor.** A hacker digging through corporate servers for buried
   secrets the corp would rather keep out of the public eye, revealing major
   conspiracies along the way. Mark I never mentions secrets; the treasure is
   "Data/Agenda" and "Corporate Secrets" is a 2 VP card.

### Where the complexity lives today

- **Dials without consumers.** Tags, noise, signal, memory and server security
  are five ways of saying "the corp is onto you". Between them they are touched
  by about three cards.
- **Netrunner's most complex system, imported wholesale.** Three ice subtypes,
  five program subtypes, strength. All text-only today, and Mark I proposed
  making it spatial as well.
- **Twelve trigger moments for twenty cards.**
- **Mark I is six games.** Graph generation, mobile sentries, scanning radius,
  strata bosses, a three-tier extraction, a meatspace hub with hardware relics.
  Each is a good idea; together they are a two-year roguelike, and none of them
  are about conspiracies.

The fantasy of digging through a server for buried secrets does not need
space. It needs a stack of face-down cards and the question "one more?"

## Principles (decided)

- **Keep the core to one page of rules.** Everything else is cards.
- **The server is infinite.** You can always dig deeper. The dive ends because
  you jack out or because you die, never because the deck ran out.
- **Powerful decks last longer.** Mounting threats are a curve; a strong deck
  rides it further and deeper. Death is the default ending; winning means
  beating the curve to a goal that sits very deep.
- **No free safe out.** Jacking out must always be possible and must always
  cost something proportional to what the player stands to gain by staying.
- **The corp acts every turn, unconditionally.** Like a Slay the Spire enemy.
  A turn in which the player does nothing is a turn the corp used. This is the
  answer to "cycle the hand until the right card shows up".
- **Ice sits in front of the server and stays there until dealt with**, taxing
  every further incursion. This is the one piece of Netrunner worth keeping
  intact.
- **Conspiracies replace victory points.** Evidence is set collection; exposing
  a conspiracy is the payoff and the arc.

## The core loop (leaning)

1. **Turn.** Draw a hand, take clicks. A click plays a card or flips the next
   server card. Unplayed hand is discarded at end of turn.
2. **The wall.** Rezzed ice, face-up, in order, in front of the stack. A dive
   passes every card in the wall before the first flip. Each ice is paid with
   discards equal to its strength, broken with a card, or clicked through
   (eat the subroutine). It stays in the wall afterward.
3. **Flip.** Evidence goes to the dossier face-up. Junk is nothing. A trap
   fires and is gone. Ice flipped from the stack is encountered on the spot,
   unprepared, then joins the wall: it hurts now and taxes every dive after.
4. **Jack out.** Any time the player is not facing ice. Evidence in the dossier
   is banked. Trace resets. The deck is edited (loot found while diving only
   becomes cards in the safehouse). The cost of jacking out is **open**, see
   below.
5. **Corp tick.** Every turn, connected or not. Security rises by one, always,
   and never comes down. Individual cards scale with it (Fire Wall's strength,
   a trap's damage), printed on the card, not as a global rule (**decided**
   2026-09-11). The corp installs new ice on the wall **face-down**: the
   player knows the wall got thicker, not with what. It rezzes on first
   contact. When and how often the corp installs is **open**.
6. **Expose.** Hold every piece of a thread and the conspiracy is revealed.
   Permanent reward. The corp answers (new ice, higher tier).
7. **Win and lose.** Expose the master conspiracy, whose pieces only appear
   past a certain depth. Lose when caught.

Two numbers on screen, both already in the codebase in some form:

| Number   | Role                       | Rises on                                               | Resets      |
| -------- | -------------------------- | ------------------------------------------------------ | ----------- |
| Trace    | Health for this connection | Flips, noisy cards, once per corp turn while connected | On jack-out |
| Security | The clock                  | Once per corp turn, always                             | Never       |

### Why the wall

- **Every dive opens with a read, not a gamble.** The wall is face-up and its
  total cost is one number. Hand of five, wall costs three, two cards left for
  the depths. Do I go?
- **It splits the two costs cleanly.** The wall taxes cards and clicks. The
  depths tax Trace. A player can be rich in one and broke in the other.
- **Short dives are a waste and long dives a commitment.** Paying the wall to
  flip two cards and leave feels terrible, which is the right pressure.
- **Flatline is a one-line rule.** Damage you cannot pay from hand means you
  are caught: lose this dive's unbanked evidence. No health stat. The wall
  eating the hand before the depths is what makes the rule bite.
- **Deeper is better.** Cards deeper in the stack come from nastier pools and
  their evidence belongs to bigger conspiracies. Generate lazily from a seed
  (Mark I's trick), stratified by depth.

The wall needs two things or it becomes a death spiral rather than a clock:

- **Permanent answers must exist.** Break cards pass an ice once. Trash or
  derez cards remove it from the wall, rarer and costlier. Exposing a
  conspiracy could strip one ice (leaking its source code is on-theme).
- **Passing known ice must be fast in the UI.** Facing the same three cards
  every dive is fine as a decision and tedious as a ritual. One click per ice,
  or one for the whole wall.

### Why fishing is punished

- **At depth**, waiting for the right hand costs Trace every turn, and
  Security makes any scaling ice you are waiting on stronger while you wait. The
  problem grows faster than the odds of drawing the answer.
- **At the surface**, waiting costs Security, which every scaling card you
  will face on the way back down grows with. Fishing at depth zero is a loan at
  compound interest.
- **Breakers are installed programs, not one-shot scripts.** You fish once,
  and the breaker is on the table for the rest of the game. The per-dive
  question becomes "can I afford this wall", not "did I draw the answer".
  Installed breakers should reduce a wall's cost rather than zero it, or the
  wall stops being a decision (e.g. once per dive, pass one ice of strength
  two or less for free).
- **There is no empty turn, only a prep turn.** Clicks outside the dive buy
  deck edits, program installs, scouting the top face-down ice, laying low to
  lower Trace. "I did not dive" is a choice among tempo actions, made while
  the corp ticked.

## The conspiracy layer (leaning)

This is what makes the flip exciting rather than a slot machine.

- **Evidence is diegetic.** Each piece is a document: "Wire transfer, 14 Mar",
  "Deleted board minutes", "Lab intake form". Its thread is printed on it, or
  partly hidden. The existing `FILE` card type becomes Evidence.
- **Redacted evidence.** Some pieces enter the dossier face-down. The thread is
  learned only by banking it or playing a decode card. Digging for a thread you
  cannot yet read is a real decision.
- **Disinformation.** A trap that looks like evidence and shuffles an
  unplayable card into the player's deck (Friday's aging cards). The corp is
  feeding you a story. The existing Junk card is the seed of this.
- **Exposure has a cost.** Going public is loud; each expose lets the corp
  answer. The arc is naturally "small scandal, bigger scandal, the thing they
  killed people over". Threads generated from a small table of subjects, crimes
  and cover-ups, so every game's conspiracies read differently.
- **The dossier is the score screen.** The end state is the wall of pinned
  documents and red string.

## Borrowed mechanics

| Borrowed from                  | Mechanic                                                                | Replaces                                          |
| ------------------------------ | ----------------------------------------------------------------------- | ------------------------------------------------- |
| Incan Gold, Deep Sea Adventure | Flip the next card or jack out and bank. Deeper is better.              | Map, strata, scanning, sentries, backdoors        |
| Deep Sea Adventure             | One rising counter (Trace). Max means caught: lose the dive's evidence. | Tags, noise, signal, flatline, dumpshock          |
| Netrunner                      | Ice in front of the server, persistent, face-down until rezzed.         | Kept; the one imported system worth keeping whole |
| Regicide, Slay the Spire       | Hand is health. Ice hurts by making you discard.                        | Net damage stat, memory                           |
| Ticket to Ride                 | Evidence belongs to a thread; complete a thread to expose a conspiracy. | Victory points, agendas                           |
| Friday                         | Failure pollutes your deck (Disinformation).                            | New, but Junk already exists                      |
| Dominion, Slay the Spire       | Trash keyword, pick one of three card rewards.                          | Kept                                              |
| Hades                          | The safehouse is a screen, not a place. Deck edits happen there.        | Mark I's meatspace hub, minus hardware relics     |

## The cut

What goes, from the current code and from Mark I:

- Stats: tags, noise, signal, memory. Trace and Security remain.
- Ice subtypes and program subtypes (the barrier/code gate/sentry and
  fracter/decoder/killer matrix). Ice keeps strength as its only number.
- Activated abilities and the Upkeep phase.
- The accessed-cards selection flow (one flip at a time instead).
- The server enum (HQ / R&D / Archives). One server.
- Most trigger moments. Likely survivors: ON_PLAY, ON_ENCOUNTER, ON_ACCESS,
  ON_TRASH, and one for the corp tick.
- All of Mark I's spatial layer: graph, strata bosses, mobile sentries,
  scanning, backdoors, dumpshock, hardware relics, re-icing behind the player.

What survives untouched: the card engine (EffectSpec, keywords, conditions,
generated text), the event bus, the phase skeleton, the installed-ice / rez /
encounter machinery.

## Rejected

- **Corp tick only while jacked in.** Makes jacking out the safest thing in
  the game and fishing at the surface free. The corp acts every turn.
- **Shredding** (the corp removes the deepest card of a finite stack every
  turn, so the game is a race between digging down and shredding up). Rejected:
  the server should be infinite, and the pressure should come from the player's
  own limits, not from the deck running out.
- **Ice behind** (the server as an endless column; ice you pass stays at its
  depth; jacking out returns you to depth zero and re-descending means paying
  every ice you left behind). Rejected. Ice belongs in front of the server,
  not along a path.
- **Unconditional wall growth every corp turn.** Stacks two doom clocks
  (Security and wall thickness) and turns the midgame into a death spiral.
  Wall growth should be reactive, or at least slower than Security.
- **Clank!-style card-gated digging.** Flipping is a basic click action; cards
  make it better, never possible (carried over from Mark I).

## Open questions

- **What does jacking out cost?** This is the central unresolved tension.
  Constraints: the server is infinite; ice sits in front, not behind; the cost
  must scale with what the player would gain by staying; Trace resetting is
  the relief valve and must stay meaningful. Candidates, none agreed:
  - Trace decays partially on jack-out instead of resetting fully.
  - The corp installs ice on the wall in response to each breach, so every
    incursion faces a thicker front (reactive wall growth as the jack-out tax).
  - Jacking out costs a card from the deck (brain damage) or a piece of
    unbanked evidence.
  - Depth persists between dives in some form that does not put ice behind the
    player.
- **When does the corp install ice?** Every turn (rejected as too fast), on
  expose, on Trace thresholds during a dive, on jack-out, or some mix.
- **Does a dive span turns?** Encounters persisting across turns was decided in
  Mark I and still seems right; confirm under the new model.
- **Hand as health.** Confirm that "damage you cannot pay from hand = caught"
  holds up once the wall is eating the hand first. Watch for degenerate
  hand-size stacking.
- **Numbers to tune.** Hand size against wall cost at various wall sizes;
  Security growth against deck cycle rate; how many pieces a thread needs; how
  deep the master conspiracy sits.
- **What powerful decks actually do.** Pay the wall cheaply (installed
  breakers), manage Trace, dig faster (flip two), read the stack (peek), bank
  mid-dive (upload). Each is one effect primitive.

## Next step

Rewrite the rules as a one-page sheet plus a card list of about thirty cards,
and play it on the table with index cards before touching the store. The
jack-out cost question should be answered by paper play, not by argument.
