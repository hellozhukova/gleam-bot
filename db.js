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

const existing = db.prepare('PRAGMA table_info(users)').all().map((c) => c.name);

function addColumn(name, definition) {
  if(!existing.includes(name)) {
    db.exec(`ALTER TABLE users ADD COLUMN ${name} ${definition}`);
  }
}

addColumn('shards', 'INTEGER NOT NULL DEFAULT 0');
addColumn('energy', 'INTEGER NOT NULL DEFAULT 10');
addColumn('energy_updated', 'INTEGER NOT NULL DEFAULT 0');
addColumn('pickaxe', 'INTEGER NOT NULL DEFAULT 1');

function getUser(guildId, userId) {
  db.prepare('INSERT OR IGNORE INTO users (guild_id, user_id) VALUES (?, ?)')
    .run(guildId, userId);
  return db
    .prepare('SELECT * FROM users WHERE guild_id = ? AND user_id = ?')
    .get(guildId, userId);
}
console.log(db.prepare('PRAGMA table_info(users)').all().map((c) => c.name));
module.exports = { db, getUser };