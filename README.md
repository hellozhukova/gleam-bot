# Gleam

**Mini-games that keep Discord communities active.**

Gleam is a Discord bot with a built-in game. Members play every day,
compete on the leaderboard, earn roles and badges, and talk about it
in the server. For server owners, that means more activity and
members who come back.

## The game: Gleam Mines
A small mining game that opens right inside Discord.

- Tap a block next to your miner — the miner walks there and digs
- Every hit costs energy, and energy refills over time
- Dig deeper for rarer ore: coal, copper, silver, gold and more
- Some blocks can't be broken, so every mine is a small maze
- Upgrade your pickaxe with ore to break strong blocks faster
- Buy new mines with coins, each with its own ore
- Unlock badges and climb the server leaderboard

Every player has their own mine, and the mine goes down forever.

> Gleam Mines is in development. The current version has a simple
> button-based game; the full game with graphics is being built now.

## What server owners get
- **Daily activity:** energy refills over time, so members come back every day
- **Reasons to talk:** stats and leaderboards are shared in chat
- **Rewards on the server:** colored roles, role icons, a separate section
  in the member list, and access to private channels for top miners
- **Your rules:** choose which rewards to turn on for your server *(coming soon)*

## Commands
- `/mine` — open the mining panel
- `/daily` — claim your daily coins
- `/balance` — show your coins
- `/profile` — show your stats
- `/leaderboard` — top 10 players on the server
- `/ping` — check that the bot is online

## Roadmap
- [x] Bot basics: daily rewards, profile, leaderboard
- [x] Button-based mining game
- [ ] **Server API** — game logic and the mine map on the server
- [ ] **Game prototype** — the mining game with graphics in the browser
- [ ] **Discord integration** — the game opens inside Discord
- [ ] **Rewards and community** — new mines, badges, roles and stats

Game design: [docs/game-design.md](docs/game-design.md)

## Tech
Node.js · discord.js · SQLite · Express

## Setup
1. Clone the repo and run `npm install`
2. Copy `.env.example` to `.env` and fill in your values
3. Run `npm run deploy` once to register the commands
4. Start the bot with `npm start`