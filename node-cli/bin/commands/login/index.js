// @flow

import shell from 'shelljs';

const fs = require('fs');
const YAML = require('json-to-pretty-yaml');
const prompt = require('./prompt');
const store = require('../../utils');

module.exports = {

    command: 'login',
    describe: 'Authenticate with mlc platform.',

    handler: (argv) => {

        prompt().then((result) => {

        });
    },
};
