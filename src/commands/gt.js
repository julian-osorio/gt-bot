const { SlashCommandBuilder, userMention, roleMention } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

// TODO: let someone reset their selection

const [MAX_HR, MIN_HR, MAX_MINS, MIN_MINS] = [24, 0, 1440, 0]

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gt')
    .setDescription('Set reminder for game time.')
    .addRoleOption(role => 
        role
        .setName('role')
        .setDescription('Role you would like to ping')
        .setRequired(true)
    )
    .addIntegerOption(num => 
        num
        .setName('hours')
        .setDescription('Hours until game time')
    )
    .addIntegerOption(num => 
        num
        .setName('minutes')
        .setDescription('Minutes until game time')
    ),
    async execute(interaction) {
        console.log("Executing gt command.");
        const hr = interaction.options.getInteger('hours');
        const min = interaction.options.getInteger('minutes');
        const role = interaction.options.getRole('role');
        const channel = interaction.channel;
        const usr = interaction.user.id;

        console.log("Hour: " + hr + "\nMin: " + min);

        try {
            if (hr === null && min === null) throw new Error("Time not provided.");

            let msg = `Timer Set! ${userMention(usr)} set the timer to${hr !== null ? " " + hr + " hours" : ""}${(hr !== null && min !== null) ? " and" : ""}${min !== null ? " " + min + " minutes." : "."}`;
            await interaction.reply(msg);

            let ms = tomiliseconds(hr, min);
            await wait(ms);
    
            channel.send(roleMention(role.id) + " let's goooooooooooooooooooo!");
        } catch (e) {
            await interaction.reply({content: e.toString(), ephemeral: true});
            console.log(e);
        }
    },
};

function tomiliseconds(hrs,min) {
    console.log('converting to ms');
    return (hrs*60*60+min*60)*1000;
}
