const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

async function getRandomProblem(difficulty) {
    try {
        let res = await axios({
            url: 'https://leetcode.com/api/problems/algorithms/',
            method: 'get',
            timeout: 8000,
            headers: {
                'Content-Type': 'application/json',
            }
        })
        console.log(res.status + ' from MDN Web Docs.');

        let questions = res.data.stat_status_pairs;
        let filteredQs = Object.values(questions).filter(q => q.difficulty.level === difficulty);

        return filteredQs[Math.floor(Math.random() * filteredQs.length)].stat.question__title_slug
    } catch (err) {
        console.error(err)
    }
}

function makeUrl(titleSlug) {
    return 'https://leetcode.com/problems/' + titleSlug + '/';
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lc')
    .setDescription('Random leetcode problem!')
    .addIntegerOption(opt => 
        opt.setName('difficulty')
            .setDescription('Difficulty of problem')
            .setRequired(true)   
            .addChoices(
                { name: 'Easy', value: 1 },
				{ name: 'Medium', value: 2 },
				{ name: 'Hard', value: 3 },
            ) 
    ),
  async execute(interaction) {
    let title = await getRandomProblem(interaction.options.getInteger('difficulty'));
    await interaction.reply(makeUrl(title));
  },
};