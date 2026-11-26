const Database = require('better-sqlite3');
const db = new Database('bot.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    guild_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    coins INTEGER NOT NULL DEFAULT 0,
    xp INTEGER NOT NULL DEFAULT 0,
    last_daily INTEGER NOT NULL DEFAULT 0,
    streak INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (guild_id, user_id)
  )
`);

function getUser(guildId, userId) {
  db.prepare('INSERT OR IGNORE INTO users (guild_id, user_id) VALUES (?, ?)')
    .run(guildId, userId);
  return db
    .prepare('SELECT * FROM users WHERE guild_id = ? AND user_id = ?')
    .get(guildId, userId);
}

module.exports = { db, getUser };