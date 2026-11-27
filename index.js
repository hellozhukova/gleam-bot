require('dotenv').config();
const { Client, GatewayIntentBits, MessageFlags } = require('discord.js');
const { db, getUser } = require('./db');
const { openMinePanel, handleButton } = require('./game');


const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('clientReady', () => {
  console.log(`Gleam is online as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isButton()) {
    return handleButton(interaction);
  }
  if (!interaction.isChatInputCommand()) return;

  const { commandName, guildId } = interaction;
  const userId = interaction.user.id;

  if (commandName === 'ping') {
    return interaction.reply('Pong!');
  }

  if (commandName === 'daily') {
    const user = getUser(guildId, userId);
    const now = Date.now();
    const DAY = 24 * 60 * 60 * 1000;

    if (now - user.last_daily < DAY) {
      const hoursLeft = Math.ceil((DAY - (now - user.last_daily)) / 3600000);
      return interaction.reply({
        content: `Come back in about ${hoursLeft}h.`,
        flags: MessageFlags.Ephemeral,
      });
    }

    // the streak continues if you claimed within the last 48 hours
    const streak = now - user.last_daily < 2 * DAY ? user.streak + 1 : 1;
    const reward = 100 + Math.min(streak, 7) * 10;

    db.prepare(
      'UPDATE users SET coins = coins + ?, streak = ?, last_daily = ? WHERE guild_id = ? AND user_id = ?'
    ).run(reward, streak, now, guildId, userId);

    return interaction.reply(`+${reward} coins! Streak: ${streak} day(s)`);
  }

  if (commandName === 'balance') {
    const user = getUser(guildId, userId);
    return interaction.reply({
      content: `You have ${user.coins} coins.`,
      flags: MessageFlags.Ephemeral,
    });
  }

  if (commandName === 'profile') {
    const user = getUser(guildId, userId);
    return interaction.reply({
      content: `Coins: ${user.coins}\nXP: ${user.xp}\nStreak: ${user.streak}\nShards: ${user.shards}\nPickaxe level: ${user.pickaxe}`,
      flags: MessageFlags.Ephemeral,
    });
  }

  if (commandName === 'mine') {
    return openMinePanel(interaction);
  }

  if (commandName === 'leaderboard') {
    const rows = db
      .prepare(
        'SELECT user_id, coins FROM users WHERE guild_id = ? ORDER BY coins DESC LIMIT 10'
      )
      .all(guildId);

    const text = rows.length
      ? rows.map((r, i) => `${i + 1}. <@${r.user_id}> — ${r.coins}`).join('\n')
      : 'No players yet. Use /daily to start!';

    return interaction.reply({ content: text, allowedMentions: { parse: [] } });
  }
});

client.login(process.env.TOKEN);