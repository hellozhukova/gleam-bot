const { db, getUser } = require('./db');

const UPGRADE_BASE_COST = 200;
const SHARD_PRICE = 2;
const MAX_ENERGY = 10;
const REGEN_MS = 30 * 1000; // one energy every 30 sec

function refreshEnergy(guildId, userId) {
    const user = getUser(guildId, userId);
    const now = Date.now();

    if (user.energy >= MAX_ENERGY) {
        db.prepare(
            'UPDATE users SET energy_updated = ? WHERE guild_id = ? AND user_id = ?'
        ).run(now, guildId, userId);
    } else {
        const gained = Math.floor((now - user.energy_updated) / REGEN_MS);
        if (gained > 0) {
            const newEnergy = Math.min(MAX_ENERGY, user.energy + gained);
            const newUpdated = newEnergy >= MAX_ENERGY ? now : user.energy_updated + gained * REGEN_MS;
            db.prepare(
                'UPDATE users SET energy = ?, energy_updated = ? WHERE guild_id = ? AND user_id = ?'
            ).run(newEnergy, newUpdated, guildId, userId);
        }
    }

    return getUser(guildId, userId);
}

module.exports = { UPGRADE_BASE_COST, SHARD_PRICE, MAX_ENERGY, REGEN_MS, refreshEnergy };