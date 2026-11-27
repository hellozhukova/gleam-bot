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

function handleButton(interaction) {
    if (interaction.customId !== 'mine') return;
    const found = Math.floor(Math.random() * 3) + 1;

    const guildId = interaction.guild.id;
    const userId = interaction.user.id;
    getUser(guildId, userId);
    db.prepare(
        'UPDATE users SET shards = shards + ? WHERE guild_id = ? AND user_id = ?'
    ).run(found, guildId, userId);

    const user = getUser(guildId, userId);

    return interaction.update({ content: `You found ${found} shards. Total: ${user.shards}` });
}

module.exports = { openMinePanel, handleButton };