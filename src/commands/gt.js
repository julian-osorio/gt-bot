const { SlashCommandBuilder, userMention, roleMention } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gt')
    .setDescription('Set reminder for game time.')
    .addNumberOption(num => 
        num
        .setName('time')
        .setDescription('Time until game time')
        .setRequired(true)
    )
    .addRoleOption(role => 
        role
        .setName('role')
        .setDescription('Role you would like to ping')
        .setRequired(true)
    ),
    async execute(interaction) {
        const time = interaction.options.getNumber('time');
        const role = interaction.options.getRole('role');
        const channel = interaction.channel;
        const usr = interaction.user.id;
        
        await interaction.reply('Timer Set! ' + userMention(usr) + " set the timer to " + time + "ms");
        await wait(time);

        channel.send(roleMention(role.id) + " RING RING RING HAHAHAHA");
    },
};