// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

commandFiles.forEach((cmdFile) => {
  /* eslint-disable */
  const filePath = path.join(commandsPath, cmdFile);
  const command = require(filePath);
  /* eslint-enable */
  client.commands.set(command.data.name, command);
});

// When the client is ready, run this code (only once)
client.once('ready', () => {
  fs.writeFileSync('database.json', '{}');
  console.log('Ready!');
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

// Login to Discord with your client's token
client.login(process.env.BOT_TOKEN);
