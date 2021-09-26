'use strict';

module.exports = {

  command: 'mkdir <dir> [otherDirs...]',
  describe: 'Make a new directory',

  handler: (argv) => {
    let {dir, otherDirs} = argv;

    console.log(
      `Running command mkdir ... \n` +
      `Arguments received: \n` +
      `dir: ${dir} \n` +
      `otherDirs: ${otherDirs}`
    );
  }
};
