const { SlashCommandBuilder, userMention, roleMention } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const fs = require('fs');

const MAX_MINS = 1440;
const REQ_PATH = 'database.json';

const tomiliseconds = function tomiliseconds(hrs, min) {
  return (hrs * 60 * 60 + min * 60) * 1000;
};

const storeData = (data) => {
  try {
    fs.writeFile(REQ_PATH, JSON.stringify(data), (err) => {
      if (err) {
        console.log(err);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gt')
    .setDescription('Set reminder for game time.')
    .addRoleOption((role) => role
      .setName('role')
      .setDescription('Role you would like to ping')
      .setRequired(true))
    .addIntegerOption((num) => num
      .setName('hours')
      .setDescription('Hours until game time'))
    .addIntegerOption((num) => num
      .setName('minutes')
      .setDescription('Minutes until game time')),
  async execute(interaction) {
    console.log('Executing gt command.');
    const hr = interaction.options.getInteger('hours');
    const min = interaction.options.getInteger('minutes');
    const role = interaction.options.getRole('role');
    const { channel } = interaction;
    const usr = interaction.user.id;

    try {
      if (hr === null && min === null) throw new Error('Time not provided.');
      if ((hr * 60 + min > MAX_MINS) || (min <= 0 && hr <= 0)) { throw new Error('Invalid timer length. Must be greater than 0h 0min and less than 24h.'); }

      const ts = Date.now();

      const requestsRaw = fs.readFileSync('database.json', { encoding: 'utf-8' });

      const requests = JSON.parse(requestsRaw);
      console.log(requests);

      const newRequests = {
        ...requests,
        [usr]: { timestamp: ts },
      };

      storeData(newRequests);

      const msg = `Timer Set! ${userMention(usr)} set the timer to${hr !== null ? ` ${hr} hours` : ''}${(hr !== null && min !== null) ? ' and' : ''}${min !== null ? ` ${min} minutes.` : '.'}`;
      await interaction.reply(msg);

      const ms = tomiliseconds(hr, min);
      await wait(ms);

      const readReqRaw = fs.readFileSync('database.json', { encoding: 'utf-8' });
      const readReq = JSON.parse(readReqRaw);

      if (readReq[usr].timestamp !== ts) {
        console.log(`${ts} request from ${usr} was overwritten. Execution blocked.`);
      } else {
        channel.send(`${roleMention(role.id)} let's goooooooooooooooooooo!`);
      }
    } catch (e) {
      await interaction.reply({ content: e.toString(), ephemeral: true });
      console.log(e);
    }
  },
};
