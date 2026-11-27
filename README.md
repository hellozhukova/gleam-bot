# Gleam

A Discord bot that keeps communities active with daily rewards,
a leaderboard and a mining mini-game. Seasons and teams are coming soon.

## Features
- Daily rewards with a streak bonus
- Player profile with all your stats
- Balance and server leaderboard
- Gleam Mining mini-game (`/mine`):
  - tap to mine shards
  - energy that refills over time
  - sell shards for coins
  - upgrade your pickaxe to mine more
- SQLite storage

## Commands
- `/ping` — check that the bot is online
- `/daily` — claim your daily coins
- `/balance` — show your coins
- `/profile` — show your stats: coins, XP, streak, shards and pickaxe level
- `/leaderboard` — top 10 players on the server
- `/mine` — open the Gleam Mining panel

## Roadmap
- [x] Mini-game with coin rewards
- [ ] Shop for roles and badges
- [ ] Monthly seasons
- [ ] Guilds, duels and server goals
- [ ] Admin configuration

## Setup
1. Clone the repo and run `npm install`
2. Copy `.env.example` to `.env` and fill in your values
3. Run `npm run deploy` once to register the commands
4. Start the bot with `npm start`