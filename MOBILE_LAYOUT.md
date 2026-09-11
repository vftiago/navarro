# Mobile Layout Improvements

_Status: shelved (2026-09-11). Notes from a short investigation; nothing
implemented._

## The problem

On a Pixel 9 the game shows roughly a third of the layout visible on a 1080p
desktop. Cards look huge.

Nothing scales. The viewport meta tag (`width=device-width`) maps one CSS
pixel to ~2.6 physical pixels on that screen, so the phone reports a viewport
of about 412 CSS px in portrait and 923 in landscape, against 1920 on the
desktop. The layout is capped at 1480 CSS px and a 12rem card is 192 CSS px on
both devices. `rem` tracks the root font size, not the screen, so rem-based
card sizes were never going to help.

## Options

1. **Fixed viewport width (one line).** `<meta name="viewport" content="width=1480" />`
   in `index.html`. The phone lays the page out at desktop width and shrinks the
   whole result to fit. Desktop browsers ignore the tag. Trade-off: portrait
   shrinks to ~28% and 12px text becomes unreadable; landscape shrinks to ~62%
   and is tight but playable. Try this first, test in landscape.
2. **Zoom the game container.** `zoom` on the board, computed from viewport
   width. Same effect as option 1 but controllable per element; `zoom` affects
   layout (unlike `transform: scale`) and is supported in all major browsers.
3. **Scale cards with the viewport.** One `--card-w` custom property with a
   `clamp()` on `vw`, every card dimension (portrait card, ice bar) derived from
   it, and `em` units inside the card so text and padding shrink with it. The
   settings sizes (sm/xs) become a multiplier. Most work; the only option that
   makes portrait usable without a separate layout. Note Mantine sizes go
   through `--mantine-scale` while Tailwind classes do not, so mixing the two
   inside a card scales unevenly.

## Decision pending

Whether portrait matters at all. If landscape-only is acceptable, option 1 is
enough. Otherwise option 3, and the hand and wall probably need their own
mobile arrangement on top of it.
