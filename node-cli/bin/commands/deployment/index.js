
const path = require('path');
const yargs = require('yargs');

module.exports = {

    command: 'deployment',
    aliases: ['deploy'],
    describe: 'Lists all files in the directory',

    builder() {
        return yargs.commandDir(path.resolve(__dirname, 'deploy-commands'), {
            recurse: true,
            exclude: /prompt\.js$/,
        });
    },


    handler: (argv) => {
        console.log('DEPLOY BASE COMMAND ');
    },
};
