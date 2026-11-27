const { db, getUser } = require('./db');

const { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');

function openMinePanel(interaction) {
    const button = new ButtonBuilder()
        .setCustomId('mine')
        .setLabel('Mine')
        .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);
    return interaction.reply({ content: 'Tap Mine to dig for shards!', components: [row], flags: MessageFlags.Ephemeral });
}

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

function handleButton(interaction) {
    if (interaction.customId !== 'mine') return;

    const guildId = interaction.guild.id;
    const userId = interaction.user.id;

    const user = refreshEnergy(guildId, userId);
    if (user.energy < 1) {
        return interaction.update({content: 'Out of energy!'});
    }

    const found = Math.floor(Math.random() * 3) + 1;

    db.prepare(
        'UPDATE users SET shards = shards + ?, energy = energy - 1 WHERE guild_id = ? AND user_id = ?'
    ).run(found, guildId, userId);

    const updated = getUser(guildId, userId);

    return interaction.update({
        content: `You found ${found} shards. Total: ${updated.shards}. Energy: ${updated.energy}.`
    });
}

module.exports = { openMinePanel, handleButton };