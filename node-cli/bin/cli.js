/**
 * This file intialize your CLI and load the commands
 */

/**
 * Load the yargs instance
 * @link https://github.com/yargs/yargs
 */
const yargs = require('yargs');

/**
 * commandDir will enable loading each command as module from a given directory
 * @link https://github.com/yargs/yargs#commanddirdirectory-opts
 */
yargs.commandDir(
    './commands', // path for loading commands
    {
        recurse: true,
        // exclude: /prompt\.js$/,
        exclude: (a) => {
            if (['prompt.js', 'deploy-commands', 'run-commands'].some(item => a.includes(item))) return true;
            return false;
        },
    },
);

/**
 * Set the default options like -version, -help etc.
 */
require('./yargs-config')(yargs);

// Pass the argv to yargs intsance
const { argv } = yargs;

/**
 * Pass the user input to applicatin except when 'rm' command is executed
 * rm is using prompt which is async, so it should load application after
 * the prompt promize is resolved
 */
if (!argv._.includes('rm')) {
    console.log({ argv });
    const App = require('../src/index');
    new App(argv);
}
