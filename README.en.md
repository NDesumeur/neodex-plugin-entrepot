# Entrepôt (Warehouse)

A box-pushing puzzle: guide the warehouse keeper to put every crate on the yellow marks. They push a crate by walking into it, but can never pull it: every push counts.

*Version française : [README.md](README.md)*

## Controls

- **Arrows** or **ZQSD** (WASD on a QWERTY keyboard): move the keeper.
- **With the mouse**: click next to the character to move them that way.
- **Backspace** or the **Undo** button: go back one step, as many times as you like.
- **R**: restart the level.
- **Gamepad**: the d-pad or stick to walk (held, the step repeats), **B** to undo, **Y** to restart, **A** or **Start** for the next level.
- **Full screen**: the button of the same name; Escape to leave it.

## Rules

- You push **one crate at a time**: you cannot push two crates in a row or a crate against a wall.
- You can **never pull** a crate. A crate pushed into a corner will never come out: undo to save it.
- The level is solved when every crate is on a mark. The counter at the top shows your **steps** and **pushes**. Each crate slides to its new square with a wooden scrape, and chimes when it lands on a mark.

## The levels

- **40 warehouses** designed by hand, sorted from easiest to hardest: the order follows the minimum number of pushes, worked out by a solver that also checks every level can be solved. Each solved level opens the next; pick it from the list, where a ✓ marks those you have finished.
- **Random**: a warehouse generated on demand, always solvable. It is built backwards: crates start on the marks and the keeper pulls them, so they can always be pushed back.

## Statistics

The Records panel shows the **levels finished** out of 40, the number of **random warehouses** solved and your **step record** on the current level.

## Data and sync

Levels finished in the previous version stay ticked: they simply took their place in the new order.

Your finished levels and step records are stored by NeoDex, backed up and synced between your PCs when sync is on.

## Install

In NeoDex: **NeoStore → Discover → Entrepôt → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
