const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

function makeUrl(mdnUrlSlug) {
  return `<https://developer.mozilla.org${mdnUrlSlug}/>`;
}

async function mdnLookup(query) {
  const queryArray = query.split(' ');
  const queryFormatted = queryArray.join('+');

  try {
    // HTTP GET request.
    const res = await axios({
      url: `https://developer.mozilla.org/api/v1/search?q=${queryFormatted}&locale=en-US`,
      method: 'get',
      timeout: 8000,
      headers: {
        'Content-type': 'application/json',
      },
    });

    console.log(`${res.status} from MDN Web Docs.`);

    const resArray = res.data.documents;

    if (resArray.length === 0) {
      throw new Error('Empty Results');
    }

    const sliceResArr = resArray.slice(0, 3);

    const topResults = sliceResArr.map((result) => ({
      title: result.title, url: makeUrl(result.mdn_url),
    }));

    return topResults;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mdn')
    .setDescription('Search MDN Web Docs!')
    .addStringOption((opt) => opt.setName('query')
      .setDescription('MDN Search term(s).')
      .setRequired(true)),
  async execute(interaction) {
    console.log('Executing mdn command.');
    try {
      const query = interaction.options.getString('query');
      const searchResults = await mdnLookup(query);
      let botResponse = `Here's what I found for *${query}* ...`;

      searchResults.forEach((result) => {
        botResponse += `\n**${result.title}**\n${result.url}`;
      });

      await interaction.reply(botResponse);
    } catch (err) {
      await interaction.reply({ content: err.toString(), ephemeral: true });
    }
  },
};
