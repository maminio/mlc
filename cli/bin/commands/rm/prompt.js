let inquirer = require('inquirer');
var chalk = require('chalk');

module.exports = function(app){

  let questions = [
    {
      type: 'input',
      name: 'confirm',
      message: chalk.blue(`Are you sure wants to delete file "${app.filename}"?`)
    }
  ];

  return inquirer.prompt(questions)
  .then((answers) => {
    console.log(
      `Answers received:\n` +
      `confirm: ${answers.confirm} \n`
    );
    return Object.assign(app, answers);
  })
}
