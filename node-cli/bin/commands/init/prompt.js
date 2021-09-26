// @flow

const inquirer = require('inquirer');
const chalk = require('chalk');
const path = require('path');

module.exports = () => {
    const questions = [
        {
            type: 'input',
            name: 'name',
            message: chalk.blue('What is the name of your project?'),
            default: path.basename(process.cwd()),
        },
        {
            type: 'list',
            name: 'language',
            message: 'What language are you using? 📦',
            choices: [
                'python-2.7',
                'python-3.x',
            ],
        },
        {
            type: 'list',
            name: 'framework',
            message: 'What is th main framework of your project?',
            choices: [
                'tensorflow',
                'pytorch',
                'keras',
                'others',
            ],
        },
    ];

    return inquirer.prompt(questions)
        .then((answers) => {
            console.log({ answers })
            return answers;
        });
};
