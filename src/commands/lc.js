const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const { unescape } = require('html-escaper');

async function getRandomProblem(difficulty) {
  const res = await axios({
    url: 'https://leetcode.com/api/problems/algorithms/',
    method: 'get',
    timeout: 8000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  console.log(`${res.status} from Leetcode.`);

  const questions = res.data.stat_status_pairs;
  const filteredQs = Object.values(questions).filter((q) => q.difficulty.level === difficulty);

  return filteredQs[Math.floor(Math.random() * filteredQs.length)].stat.question__title_slug;
}

function makeUrl(titleSlug) {
  return `https://leetcode.com/problems/${titleSlug}/`;
}

function parseContent(content) {
  return unescape(content
    .replaceAll(/<[^>]+>/g, '')
    .replaceAll(/\n\s*\n/g, '\n')
    .split('&nbsp')[0]);
}

async function getProblemData(titleSlug) {
  const res = await axios({
    url: 'https://leetcode.com/graphql',
    method: 'post',
    headers: {
      Accept: '*/*',
      'Accept-Language': 'en-US,en;q=0.5',
      'content-type': 'application/json',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
    },
    /* eslint-disable */
    data: `{\"operationName\":\"questionData\",\"variables\":{\"titleSlug\":\"${titleSlug}\"},\"query\":\"query questionData($titleSlug: String!) {\\n  question(titleSlug: $titleSlug) {\\n    questionId\\n    questionFrontendId\\n    boundTopicId\\n    title\\n    titleSlug\\n    content\\n    translatedTitle\\n    translatedContent\\n    isPaidOnly\\n    difficulty\\n    likes\\n    dislikes\\n    isLiked\\n    similarQuestions\\n    exampleTestcases\\n    categoryTitle\\n    contributors {\\n      username\\n      profileUrl\\n      avatarUrl\\n      __typename\\n    }\\n    topicTags {\\n      name\\n      slug\\n      translatedName\\n      __typename\\n    }\\n    companyTagStats\\n    codeSnippets {\\n      lang\\n      langSlug\\n      code\\n      __typename\\n    }\\n    stats\\n    hints\\n    solution {\\n      id\\n      canSeeDetail\\n      paidOnly\\n      hasVideoSolution\\n      paidOnlyVideo\\n      __typename\\n    }\\n    status\\n    sampleTestCase\\n    metaData\\n    judgerAvailable\\n    judgeType\\n    mysqlSchemas\\n    enableRunCode\\n    enableTestMode\\n    enableDebugger\\n    envInfo\\n    libraryUrl\\n    adminUrl\\n    challengeQuestion {\\n      id\\n      date\\n      incompleteChallengeCount\\n      streakCount\\n      type\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\"}`,
    /* eslint-enable */
  });

  let { title } = res.data.data.question;
  let content = '';
  if (res.data.data.question.isPaidOnly) {
    title = `*Leetcode Premium Question*: ${title}`;
    content = 'See link on premium account for description...';
  } else {
    content = parseContent(res.data.data.question.content);
  }
  const data = { title, content };

  return data;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lc')
    .setDescription('Random leetcode problem!')
    .addIntegerOption((opt) => opt.setName('difficulty')
      .setDescription('Difficulty of problem')
      .setRequired(true)
      .addChoices(
        { name: 'Easy', value: 1 },
        { name: 'Medium', value: 2 },
        { name: 'Hard', value: 3 },
      )),
  async execute(interaction) {
    try {
      const title = await getRandomProblem(interaction.options.getInteger('difficulty'));
      const problemData = await getProblemData(title);
      console.log(problemData);
      await interaction.reply(`**${problemData.title}**\n${problemData.content}\n${makeUrl(title)}`);
    } catch (err) {
      await interaction.reply({ content: err.toString(), ephemeral: true });
    }
  },
};
