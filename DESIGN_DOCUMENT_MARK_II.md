# Design Document Mark II: The Dig

_Status: exploratory. Started 2026-09-10, last revised 2026-10-05. Nothing here
is implemented. It supersedes `DESIGN_DOCUMENT.md` (Mark I), which is kept for
reference only. Items are marked **decided**, **leaning** or **open**; what was
tried and dropped is listed once, briefly, under "Rejected"._

## Why a Mark II

Two original intentions got lost along the way and this document restores
them:

1. **A minimal core ruleset.** The loop (draw, spend clicks, run, access,
   discard) is simple. The bloat crept in around it.
2. **Conspiracy flavor.** A hacker digging through corporate servers for
   secrets the corp would rather bury, exposing conspiracies along the way.

The fantasy does not need a map. It needs a stack of face-down cards and the
question "one more run?"

## Principles (decided)

- **One page of rules.** Everything else is cards.
- **The card game is played jacked in.** A job is one jacked-in session,
  Slay the Spire's fight: turns, clicks, runs, flips and corp ticks all happen
  inside it. Jacking in from the hideout starts a job. Jacking out ends it
  and returns to the hideout, either carrying the objective or fleeing
  because death was imminent (Slay the Spire's smoke bomb). Jacking out means
  nothing else. "Encounter" is reserved for facing one ice, as in the code
  and in Netrunner.
- **A run is one click and goes all the way.** Past every ice, through its
  accesses, with no stopping in between. It ends when its accesses are done
  or a subroutine ends it. Only a card or some other condition can grant an
  early exit or change the price.
- **The server is infinite.** You can always dig deeper. A job ends because
  you jack out or die, never because the deck ran out.
- **The corp acts every turn of the job, unconditionally.** A turn in
  which the player does nothing is a turn the corp used. This is the answer to
  "cycle the hand until the right card shows up".
- **Ice sits in front of the server and stays there until dealt with**,
  taxing every further run.
- **Hand is health.** Damage discards from hand, and nothing else does. A
  card leaves the hand only by being played or by damage; unplayed cards are
  never spent as currency.
- **Breaking is free; the subroutine is the tax.** A breaker either breaks an
  ice or it cannot. Ice you cannot break is passed by eating its subroutine, a
  tax the player weighs for themselves.
- **Powerful decks last longer.** Threats mount on a curve; a strong deck
  rides it further. Death is the default ending; winning means beating the
  curve to a goal that sits deep.
- **Conspiracies are a layer, not a scoring system.** They set the tone and
  can be woven into narrative and mechanics at will, on top of victory points.

## Structure of play

```
Hideout ──jack in──▶ Job ──────────jack out──▶ Hideout
(deck edits,         (the card game)         (bank the objective,
 upgrades)                                    or lick wounds)
```

### Inside a job (leaning)

1. **Turn.** Draw a hand, take clicks. A click plays a card or starts a run.
   Unplayed hand is discarded at end of turn.
2. **Run: the ice.** Rezzed ice sits face-up, in order, in front of the
   stack. The run passes every ice before the first flip. Each ice is broken
   with a matching program of sufficient strength (free), broken with a
   script (the card), or clicked through (eat the subroutine). It stays in
   front of the server afterward.
3. **Run: the flips.** Agendas and evidence are taken. Junk is nothing. A
   trap fires and is gone. Ice flipped from the stack is faced on the spot,
   unprepared, then joins the ice in front of the server: it hurts now and
   taxes every run after. How many cards a run accesses by default is
   **open**; cards modify it.
4. **Run ends.** After its accesses, or when a subroutine ends it. What was
   taken stays with the player. Within a job the stack is not
   reshuffled, so every run starts where the last one stopped and digs
   deeper (**leaning**).
5. **Corp tick.** Every turn, running or not. Security rises by one, always,
   and never comes down. Cards scale with it individually (Fire Wall's
   strength, a trap's damage), printed on the card, not as a global rule
   (**decided**). The corp installs new ice face-down: the player knows there
   is one more ice, not what it is. It rezzes on first contact. When and how
   often the corp installs is **open**.
6. **Objective.** Victory points are what the job is for. Jack out carrying
   them and the job is done. The conspiracy layer (below) rides
   on top of this.
7. **Caught.** Trace at its maximum, or damage the hand cannot pay, means you
   are caught. Caught is death. Jack out before it happens.

Two numbers drive the tension. **Trace** rises on flips, on noisy cards and
once per corp turn while running; only cards and prep actions bring it down.
**Security** rises once per corp turn and never comes down; it is the clock
that scaling cards read.

### Why it holds together

- **Every run opens with a read, not a gamble.** Rezzed ice is face-up.
  Before committing, the player can count which ice the rig breaks, which
  ones a script in hand covers, and which subroutines they will have to eat.
  Three ice, one of them a sentry with no killer. Do I go?
- **Two costs, cleanly split.** Ice taxes pain, and the cards you burn to
  avoid it. The depths tax Trace. A player can be rich in one and broke in
  the other.
- **Every run is a commitment, and the push-your-luck lives between runs.**
  Trace rose, Security rose, the hand is thinner. One more run, or jack out
  with what you have?
- **Flatline is a one-line rule.** No health stat. Damage is always a
  punishment, never a price; sentries and traps are what make it bite.
- **Deeper is better.** Cards deeper in the stack come from nastier pools and
  carry bigger secrets. Generate lazily from a seed, stratified by depth.
- **Fishing is punished at every depth.** Waiting for the right hand costs a
  corp tick, and every scaling card you will face grows with it. There is no
  empty turn, only a prep turn: clicks outside a run buy program installs,
  scouting the top face-down ice, laying low to lower Trace.
- **Breakers are installed, not drawn.** Fish once and the breaker is on the
  table for the rest of the job. The per-run question becomes "can I
  afford this ice", not "did I draw the answer". What keeps it a question:
  a breaker only handles ice up to its own strength, Security outgrows a
  static breaker, and the corp keeps adding face-down ice the rig may not
  match.
- **Persistent ice needs two things** or it becomes a death spiral rather
  than a clock. Permanent answers must exist: trash or derez cards that
  remove an ice, rarer and costlier than break cards. And passing known ice
  must be fast in the UI: one tap per ice, or one for all of it.

## Ice and breakers (decided)

Netrunner's rock-paper-scissors, kept whole, minus the credit economy and
subroutine counting.

- **One number on the ice.** Strength is the breaker threshold: a program
  breaks ice whose strength is not higher than its own. Current definitions
  need rescaling to a 1 to 4 range. Security does the scaling, on some ice,
  not all, printed on the card.
- **Three prices for one ice.** Break it with a matching program (free),
  break it with a script (the card), or eat the subroutine (pain). Breaking
  never costs a click; the run does, once.
- **Eating the subroutine is always an option.** No killer means you take the
  sentry's subroutine, not that you cannot run. Sometimes the tax is
  irrelevant, sometimes acceptable, sometimes the whole run. The matrix
  decides which ice you dread, never which ice you may attempt.
- **Subtype is only the breaker key.** Fracters break barriers, decoders
  break code gates, killers break sentries, AI breaks anything. That is all a
  subtype means. What a subroutine does is printed on the card: Ice Wall
  costs clicks, Fire Wall deals Security-scaled damage, Wall of Static ends
  the run, and all three are barriers. "End the run" is one subroutine among
  others, the harshest, rationed by tier as a card-design choice. Netrunner's
  tendencies (code gates hit Trace, sentries hurt and trash programs) guide
  the pool, they are not rules.
- **AI is the fourth breaker subtype.** What it gives up for breaking
  anything (strength, rarity, a printed drawback) is card design. Scripts
  that break ice (Crowbar) are a separate thing: a one-shot verb on a card.
- **Killer is rare, and that is an arc.** Sentries are what kills you early.
  The first killer is a milestone. The pool weights sentries deeper, so the
  starter mostly meets barriers and code gates.
- **Investment is card upgrade.** Slay the Spire's plus system: Sledgehammer+
  is strength 3, done in the hideout. Temporary pumps are tech scripts, not a
  core rule.
- **Program subtypes are the four breaker types.** A program with no breaker
  role needs no label.
- **Memory is the rig's capacity.** Installed programs occupy memory units;
  a program can only be installed while there is room. Every program costs
  one MU for now, starting capacity is three. The number moves in both
  directions (cards, rewards, corp punishment). Capacity below what is
  installed is legal and blocks further installs; nothing is trashed
  automatically.

## The starter deck (leaning)

Running is a basic click action, so the Run card retires and the starter
cannot be "the deck that lets you run". It is the deck that makes running
survivable, and every card in it should be one the player eventually wants to
cut. Slay the Spire's Strikes and Defends are the model: vanilla verbs, one or
two hook cards, nothing rare. The two vanilla verbs follow from the two costs:
pass ice safely and hold Trace down. A third, "make the flip a read", gives the
conspiracy flavor a foothold from turn one.

Twelve cards. Names are placeholders; Focus, Sledgehammer and Boost Energy
Ultra keep their ids and art, reworked.

| Count | Card               | Type             | Text                                            | Teaches                                                         |
| ----- | ------------------ | ---------------- | ----------------------------------------------- | --------------------------------------------------------------- |
| 3     | Crowbar            | Script           | Strength 3. Break the encountered ice.          | A card buys a guaranteed pass. Burn it or save it?              |
| 3     | Focus              | Script, Stealthy | Trace -2.                                       | Dead at the surface, precious at depth. Play it now or hold it? |
| 2     | Skim               | Script           | Look at the next server card. You may trash it. | The flip becomes a read. Filtering traps is the hacker verb.    |
| 1     | Backup             | Script           | Draw 2 cards.                                   | Hand is health. Draw is the heal.                               |
| 1     | Sledgehammer       | Program, Fracter | Strength 2. Break a barrier.                    | Install once, taxed less forever.                               |
| 1     | Skeleton Key       | Program, Decoder | Strength 2. Break a code gate.                  | The matrix: the right tool for the right ice.                   |
| 1     | Boost Energy Ultra | Script, Trash    | Gain 2 clicks.                                  | The Trash keyword and deck thinning.                            |

- **Why twelve.** At five cards a turn the deck cycles every two and a half
  turns, so upgrades show up fast while Security climbs. Three Crowbars plus
  two typed breakers pass two starter ice without a scratch; the rest of the
  deck is about sustaining repeated runs against a rising Trace.
- **Not in the starter, on purpose.** No "flip the next card" script: it only
  compresses clicks and dilutes the real verbs. No Junk or any dud: the first
  dead card should arrive from the server as Disinformation and mean
  something. No rares: Deep Thoughts, Running Sneakers, Piece of Cake,
  Intrusive Thoughts and Crack become rewards or go with Upkeep and activated
  abilities.
- **New primitives it needs.** Break the faced ice (with a strength and an
  optional subtype), modify Trace, peek and optionally trash the next server
  card, and a structural program break when ice is faced. Draw and
  modify_clicks exist. Focus is reworked to modify Trace.
- **Watch in paper play.** Two programs in twelve cards may be too much head
  start; if so, Skeleton Key becomes a first-reward card and Crowbar goes
  back to four. Whether Crowbar's strength should be 3 or 2. Whether Focus at
  -2 is the right size when nothing but cards lowers Trace.

## The conspiracy layer (leaning)

What makes the flip exciting rather than a slot machine. It sits on top of
victory points and touches mechanics only where it earns it.

- **Evidence is diegetic.** Each piece is a document: "Wire transfer, 14
  Mar", "Deleted board minutes", "Lab intake form". Its thread is printed on
  it, or partly hidden. The existing `FILE` card type becomes Evidence.
- **Redacted evidence.** Some pieces are taken face-down. The thread is
  learned only in the hideout or by playing a decode card. Digging for a
  thread you cannot yet read is a real decision.
- **Disinformation.** A trap that looks like evidence and shuffles an
  unplayable card into the deck (Friday's aging cards). The corp is feeding
  you a story. The existing Junk card is the seed of this.
- **Expose.** Hold every piece of a thread and the conspiracy is revealed, a
  permanent reward. Going public is loud: each expose lets the corp answer.
  The arc is "small scandal, bigger scandal, the thing they killed people
  over". Threads are generated from a small table of subjects, crimes and
  cover-ups, so every game's conspiracies read differently.
- **The dossier is the end screen.** A wall of pinned documents and red
  string.

## Exploring (open, 2026-10-05)

Ideas raised while looking at Limbus Company. None decided; each needs paper
play before any code.

- **Slot position matters.** Programs occupy ordered MU slots, and card text
  may key off the slot ("if this program is in slot 1, +2 strength"). Only a
  real decision if position has a cost too, for example sentries trashing
  the front-slot program. Cheap in the engine: one condition, one reorder
  action.
- **Coin clashes.** A breaker's strength becomes a base plus coins flipped
  on each attempt; the break lands or the subroutine fires, nothing in
  between, and a break is guaranteed when the base alone meets the ice's
  strength. Signal is the sanity analogue that moves the odds, so it needs
  sources distinct from Trace (connection quality, not corp attention). Odds
  must show on the ice before committing. Keep it one-sided: ice does not
  roll.
- **Chaining the rig into a run.** Starting a run by dragging across
  installed programs in order, assigning each to an ice. Only worth building
  if that assignment is a genuine decision; otherwise it is theatre.

## Borrowed mechanics

| From                           | Mechanic                                                                                                                         |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| Slay the Spire                 | The job (combat) as the unit of play; smoke-bomb escape; starter deck of vanilla verbs; card upgrades; pick one of three rewards |
| Incan Gold, Deep Sea Adventure | Run again or jack out and bank. Deeper is better. One rising counter whose maximum means caught.                                 |
| Netrunner                      | Ice in front of the server, persistent, face-down until rezzed; breaker strength versus ice strength; the subtype matrix         |
| Regicide                       | Hand is health; damage discards from hand                                                                                        |
| Ticket to Ride                 | Evidence belongs to a thread; complete a thread to expose a conspiracy                                                           |
| Friday                         | Failure pollutes your deck (Disinformation)                                                                                      |
| Dominion                       | The Trash keyword                                                                                                                |
| Hades                          | The hideout is a screen, not a place. Deck edits happen there.                                                                   |

## What goes, what stays

Goes, from the current code:

- The Run card. Running is a basic click action.
- Netrunner's credit economy and subroutine counting.
- The Resource program subtype label.
- Activated abilities as a generic system, and the Upkeep phase. The one
  program activation that remains is breaking, which is structural (a
  breaker breaks because it is a breaker), not a printed ability.
- The accessed-cards selection flow (one flip at a time instead).
- The server enum (HQ / R&D / Archives). One server.
- Most trigger moments. Likely survivors: ON_PLAY, ON_ENCOUNTER, ON_ACCESS,
  ON_TRASH, and one for the corp tick.
- All of Mark I's spatial layer.

Stays untouched: the card engine (EffectSpec, keywords, conditions, generated
text), the event bus, the phase skeleton, the installed-ice / rez / encounter
machinery, and every stat. Tags, noise and signal have few consumers today and
will get them from cards.

## Rejected

Listed so they are not re-proposed. One line each, on purpose.

- Corp acting only while the player is running.
- A finite stack the corp shreds from the bottom.
- Ice behind the player, or depth as a path to re-walk.
- A new ice every corp turn.
- Running gated behind cards.
- A voluntary way to end a run, and any cost or reset attached to it.
- Discarding from hand as a price for anything.
- Conspiracies as the scoring system.
- Subtypes implying subroutines (barriers always ending the run, etc.).
- Scripts standing in for the AI breaker subtype.

## Open questions

- **When does the corp install ice?** On expose, on Trace thresholds, when a
  run ends, or some mix. A prototype in `corpPhase.ts` installs one face-down
  ice every second turn and patches (replaces the outermost rezzed ice) when
  slots are full; interval and slot count are constants.
- **How many cards does a run access by default?**
- **Does Trace carry between jobs**, or is each jack-in a fresh
  connection?
- **Does a run span turns?** Facing ice across turns was decided in Mark I
  and still seems right; confirm under the new model.
- **Hand as health.** Confirm that unpayable damage as "caught" holds up when
  sentries and traps are the only things that touch the hand. Watch for
  degenerate hand-size stacking.
- **Numbers to tune.** Hand size against sentry and trap damage by depth; ice
  strength 1 to 4 against breaker strength and upgrade steps; Security growth
  against deck cycle rate; thread sizes; how deep the big secrets sit.
- **Corp install policy.** Random ice can hand a starter three sentries.
  Survivable only if surface sentries hit softly, so weight barriers and code
  gates at the surface and stratify sentries by depth or Security.
- **What powerful decks actually do.** Pass ice cheaply (installed breakers),
  manage Trace, dig faster (access two), read the stack (peek), bank mid-run
  (upload). Each is one effect primitive.

## Next step

Rewrite the rules as a one-page sheet plus a card list of about thirty cards
(the starter deck above is the first twelve), and play it on the table with
index cards before touching the store. Open numbers are answered by paper
play, not by argument.
