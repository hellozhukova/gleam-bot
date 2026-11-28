const { db, getUser } = require('./db');
const { UPGRADE_BASE_COST, SHARD_PRICE, refreshEnergy, mineShards } = require('./game-logic');

const { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');

function openMinePanel(interaction) {
    const mineButton = new ButtonBuilder()
        .setCustomId('mine')
        .setLabel('Mine')
        .setStyle(ButtonStyle.Primary);

    const sellButton = new ButtonBuilder()
        .setCustomId('sell')
        .setLabel('Sell shards')
        .setStyle(ButtonStyle.Success);

    const upgradeButton = new ButtonBuilder()
        .setCustomId('upgrade')
        .setLabel('Upgrade pickaxe')
        .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(mineButton, sellButton, upgradeButton);
    return interaction.reply({ content: 'Tap Mine to dig for shards!', components: [row], flags: MessageFlags.Ephemeral });

}

function mine(interaction) {
    const guildId = interaction.guild.id;
    const userId = interaction.user.id;

    const result = mineShards(guildId, userId);
    if (!result.ok) {
        return interaction.update({ content: 'Out of energy!'})
    }

    return interaction.update({
        content: `You found ${result.found} shards. Total: ${result.user.shards}. Energy: ${result.user.energy}. Pickaxe: ${result.user.pickaxe}`
    });
}

function sell(interaction) {
    const guildId = interaction.guild.id;
    const userId = interaction.user.id;

    const user = getUser(guildId, userId);

    if (user.shards === 0) {
        return interaction.update({ content: 'You have no shards to sell.' });
    }

    const earned = user.shards * SHARD_PRICE;
    
    db.prepare(
        'UPDATE users SET coins = coins + ?, shards = 0 WHERE guild_id = ? AND user_id = ?'
    ).run(earned, guildId, userId);

    const updated = getUser(guildId, userId);
    
    return interaction.update({ content: `Sold ${user.shards} shards for ${earned} coins. Coins: ${updated.coins}.`});
}

function upgrade(interaction) {
    const guildId = interaction.guild.id;
    const userId = interaction.user.id;

    const user = getUser(guildId, userId);

    const cost = UPGRADE_BASE_COST * user.pickaxe;

    if ( user.coins < cost) {
        return interaction.update({ content: `You need ${cost} coins to upgrade (You have ${user.coins}).` });
    }

    db.prepare(
        'UPDATE users SET coins = coins - ?, pickaxe = pickaxe + 1 WHERE guild_id = ? AND user_id = ?'
    ).run(cost, guildId, userId);

    const updated = getUser(guildId, userId);

    return interaction.update({ content: `Pickaxe upgraded to level ${updated.pickaxe}! Coins left: ${updated.coins}` });
}

function handleButton(interaction) {
    if (interaction.customId === 'mine') {
        return mine(interaction);
    }

    if (interaction.customId === 'sell') {
        return sell(interaction);
    }

    if (interaction.customId === 'upgrade') {
        return upgrade(interaction);
    }
}

module.exports = { openMinePanel, handleButton };