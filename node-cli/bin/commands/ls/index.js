'use strict';

module.exports = {

  command: 'list',
  aliases: ['ls'],
  describe: 'Lists all files in the directory',

  builder: {
    all: {
      alias: 'a',
      describe: 'Display all files',
      default: true
    },
    dots: {
      alias: 't',
      describe: 'Show only dot files',
      demandOption: true
    },
    size: {
      alias: 's',
      describe: 'Specify the file size in t-shirt format',
      choices: ['xs', 's', 'm', 'l', 'xl'],
      default: 'm',
    }
  },

  handler: (argv) => {
    let {all, dots, size} = argv;

    console.log(
      `Running command ls ... \n` +
      `-a = ${all}\n` +
      `-t = ${dots}\n` +
      `-s = ${size}`
    );
  }
};
