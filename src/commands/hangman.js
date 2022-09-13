const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

let getHangmanString = function(gameData) {
    console.log(gameData);
    let formattedWordArr = gameData.originalWord.split('').map(ch => {
        console.log(ch);
        if (gameData.guessedLetters.includes(ch)) {
            console.log("In guessed letters.");
            return ch;
        }
        console.log("Not in guessed letters.");
        return '\_';
    });
    return formattedWordArr.join(' ');
}

let getData = function() {
    const file = fs.readFileSync('database.json', { encoding: 'utf-8' });
    const data = JSON.parse(file);
    return data.hangmanGame;
}

let initGame = function(word) {
    const file = fs.readFileSync('database.json', { encoding: 'utf-8' });

    const oldData = JSON.parse(file);
    console.log(oldData);

    const newData = {
        ...oldData,
        "hangmanGame": { 
            "originalWord": word,
            "guessedLetters": [],
            "manState": 0
        },
    };
    fs.writeFileSync('database.json', JSON.stringify(newData));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hangman')
    .setDescription('Play Hangman with all your dumb friends!')
    .addStringOption(option => 
        option
          .setName('guess')    
          .setDescription('Letter or full word')
    ),
  async execute(interaction) {
    let gameData = getData();
    const guess = interaction.options.getString('guess');
    
    let msg = "";
    if (!guess) {
        initGame("banana");
        msg = ("Start the game\n" + '` ' +getHangmanString(getData()) + ' `');
    } else if (guess.length === 1) {
       msg = ("Guessed a letter: " + guess);
    } else {
       msg = ("Guessed a word: " + guess);
    }
    await interaction.reply(msg);
  },
};

// commands
// node src/deploy-commands.js
// node src/index.js
// ctrl + c to exit 

/* INITIALIZING A GAME

Bot can store 1 game
{
 ...,
 ...,
 hangmanGame: {gameData}
}

Need to store:
    1. Original word being guessed
    2. Which letters have been guessed
        a. Check which ones are in the word
        b. Count how many are not in the word, that is the man stage

gameData {
    originalWord: String,
    guessedLetters : [Char],
    manState : Number
}
*/

/*
 mvp:
 HANGMAN
 1. Single Player. `/hangman` initiates game
   a. Bot choose random word
   b. Bot presents a # of blank spaces and prompts a guess
   c. `/hangman <s>` to make guess
    i. if s is > 1 then it is a phrase guess
    ii. if s is present in word, reprint blank spaces with s revealed
    iii. if s is not in the word, hang man
*/