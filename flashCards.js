const SimpleCard = require("./BasicCard");
const Cloze = require("./ClozeCard");
const inquirer = require("inquirer");
const fs = require("fs");
var correct = 0;
var wrong = 0;
var cardArray = [];

const flashcards = () => {

        inquirer.prompt([{

                type: 'list',
                name: 'userType',
                message: 'What would you like to do?',
                choices: ['basic-quiz', 'cloze-quiz', 'quit']
            }

        ]).then(function(choice) {

           if (choice.userType === 'basic-quiz') {
                quiz('log.txt', 0);
            } else if (choice.userType === 'cloze-quiz') {
                quiz('clozeLog.txt', 0);
            } else if (choice.userType === 'quit') {
                console.log('Thanks for playing!');
            }
        });
    }
    

const readCards = (logFile) => {
    cardArray = [];
    //This grabs any previously created cards and saves them to a new array...
    fs.readFile(logFile, "utf8", function(error, data) {

        var jsonContent = JSON.parse(data);

        for (let i = 0; i < jsonContent.length; i++) {
            cardArray.push(jsonContent[i]);
        }
    });
};


const quiz = (logFile, x) => {

    fs.readFile(logFile, "utf8", function(error, data) {

        var jsonContent = JSON.parse(data);

        if (x < jsonContent.length) {

            if (jsonContent[x].hasOwnProperty("front")) {

                var gameCard = new SimpleCard(jsonContent[x].front, jsonContent[x].back);
                var gameQuestion = gameCard.front;
                var gameAnswer = gameCard.back.toLowerCase();
            } else {
                var gameCard = new Cloze(jsonContent[x].text, jsonContent[x].cloze);
                var gameQuestion = gameCard.message;
                var gameAnswer = gameCard.cloze.toLowerCase();
            }

            inquirer.prompt([{
                name: "question",
                message: gameQuestion,
                validate: function(value) {

                    if (value.length > 0) {
                        return true;
                    }
                    return 'Please least take a guess!';
                }

            }]).then(function(answers) {

                if (answers.question.toLowerCase().indexOf(gameAnswer) > -1) {
                    console.log('Correct!');
                    correct++;
                    x++;
                    quiz(logFile, x);
                } else {
                    gameCard.printAnswer();
                    wrong++;
                    x++;
                    quiz(logFile, x);
                }

            })

        } else {
            console.log('Here\'s how you did: ');
            console.log('correct: ' + correct);
            console.log('wrong: ' + wrong);
            correct = 0;
            wrong = 0;
            flashcards();
        }
    });
};


const basicPrompt = [{
    name: "front",
    message: "Enter Front of Card: "
}, {
    name: "back",
    message: "Enter Back of Card: "

}, {
    type: 'confirm',
    name: 'makeMore',
    message: 'Create another card (hit enter for YES)?',
    default: true
}]



flashcards();
