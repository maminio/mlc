
const path = require('path');
const yargs = require('yargs');

module.exports = {

    command: 'run',
    aliases: ['run'],
    describe: 'Control run functionality',

    builder() {
        return yargs.commandDir(path.resolve(__dirname, 'run-commands'), {
            recurse: true,
            exclude: /prompt\.js$/,
        });
    },


    handler: (argv) => {
        console.log('DEPLOY BASE COMMAND ');
    },
};
