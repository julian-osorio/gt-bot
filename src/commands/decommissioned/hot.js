const { SlashCommandBuilder } = require('discord.js');

function headsOrTails() {
    const choices = ['heads', 'tails'];
    return choices[Math.floor(Math.random() * choices.length)];
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hot')
    .setDescription('Play heads or tails!')
    .addStringOption(option => 
        option.setName('selection')    
            .setDescription('Heads or Tails?')
            .setRequired(true)
            .addChoices(
                { name: 'Heads', value: 'heads' },
				{ name: 'Tails', value: 'tails' },
            )
    ),
  async execute(interaction) {
    let usrInput = interaction.options.getString('selection');
    let result = headsOrTails(usrInput);
    let reply = "";
    if(usrInput === result) {
        reply = "You won! It's " + result;
    } else {
        reply = "You lost! It's " + result;
    }
    await interaction.reply(reply);
  },
};