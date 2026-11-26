const { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');

function openMinePanel(interaction) {
    const button = new ButtonBuilder()
        .setCustomId('mine')
        .setLabel('Mine')
        .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);
    return interaction.reply({ content: 'Tap Mine to dig for shards!', components: [row], flags: MessageFlags.Ephemeral });
}

module.exports = { openMinePanel };