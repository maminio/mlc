let chalk = require('chalk');

class App {

    constructor(argv){
        console.log(
          chalk.green(`\nLoading application logic...\n`) +
          chalk.grey(
            `Dumping argv:\n` +
            `${JSON.stringify(argv)}`
          ));
    }
}

module.exports = App;
