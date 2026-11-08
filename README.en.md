# Entrepôt (Warehouse)

A box-pushing puzzle: guide the warehouse keeper to put every crate on the yellow marks. They push a crate by walking into it, but can never pull it: every push counts.

*Version française : [README.md](README.md)*

## Controls

- **Arrows** or **ZQSD** (WASD on a QWERTY keyboard): move the keeper.
- **With the mouse**: click next to the character to move them that way.
- **Backspace** or the **Undo** button: go back one step, as many times as you like.
- **R**: restart the level.

## Rules

- You push **one crate at a time**: you cannot push two crates in a row or a crate against a wall.
- You can **never pull** a crate. A crate pushed into a corner will never come out: undo to save it.
- The level is solved when every crate is on a mark. The counter at the top shows your **steps** and **pushes**.

## The levels

- **12 warehouses** designed by hand, each trickier than the last. Each solved level opens the next; pick it from the list, where a ✓ marks those you have finished.
- **Random**: a warehouse generated on demand, always solvable. It is built backwards: crates start on the marks and the keeper pulls them, so they can always be pushed back.

## Statistics

The Records panel shows the **levels finished** out of 12, the number of **random warehouses** solved and your **step record** on the current level.

## Data and sync

Your finished levels and step records are stored by NeoDex, backed up and synced between your PCs when sync is on.

## Install

In NeoDex: **NeoStore → Discover → Entrepôt → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
