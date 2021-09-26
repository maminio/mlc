/**
 * Set the default options for the CLI
 * @link https://github.com/tj/commander.js
 */


const chalk = require('chalk');

module.exports = function (yargs) {
    yargs
    /**
     * Set the version of your CLI, this will be displayed when user pass -V or --version option
     */
        .version()
        .alias('version', 'v')

    /**
     * Set help options
     */
        .help('help')
        .alias('help', 'h')

    /**
     * Define the usage of the CLI
     */
        .usage(`${chalk.green('<command>')} [options]`)

    /**
     * Set other options
     */
        .options({
            debug: {
                alias: 'd',
                type: 'boolean',
                describe: 'Enable debug mode',
            },
        })

    // Set default behavior for any undefined command
        .command(
            '*',
            'the default command',
            () => {},
            (argv) => {
                if (argv._.length > 0) {
                    console.log(
                        chalk.red(
                            `Unknown Command: ${JSON.stringify(argv._)}}\n`
            + 'Specify --help for available options',
                        ),
                    );
                }
            },
        )

    /**
     * Define custom message that will appear in help command
     */
        .epilogue(
            chalk.green('For more information on how to use this application, please contact your admin.\n'),
        )

        .showHelpOnFail(false, 'Specify --help for available options')

    /**
     * Restrict any undefined command
     */
        .strict();

    return yargs;
};
