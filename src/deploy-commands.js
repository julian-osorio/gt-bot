const fs = require('node:fs');
const path = require('node:path');
const { Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
require('dotenv').config();

const { BOT_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

commandFiles.forEach((file) => {
  console.log(`Requiring ${file}...`);
  /* eslint-disable */
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  /* eslint-enable */
  commands.push(command.data.toJSON());
});

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
