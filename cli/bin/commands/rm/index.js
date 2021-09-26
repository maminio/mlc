'use strict';

let prompt = require('./prompt');

module.exports = {

  command: 'rm <filename>',
  describe: 'Remove a file',

  handler: (argv) => {
    let {filename} = argv;

    console.log(
      `Running command rm ... \n` +
      `Arguments received: \n` +
      `filename: ${filename}`
    );

    let app = {
      filename
    }

    prompt(app).then((result) => {
      console.log(
        `You have selected...\n` +
        `Delete?: ${result.confirm} \n` +
        `Deleting file '${result.filename}'...`
      );
    });

  }
};
