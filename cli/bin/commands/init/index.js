// @flow

import shell from 'shelljs';

const fs = require('fs');
const YAML = require('json-to-pretty-yaml');
const prompt = require('./prompt');
const BASE_CONFIG = require('./base.json');
import { CONFIG_FILE } from 'bin/apis/utils'

module.exports = {

    command: 'init',
    describe: 'Initialize MLC configuration file.',

    handler: (argv) => {
        /* Search for mlc-config.yaml if not exist create, if exists return message. */
        const currentDir = process.cwd();
        const files = fs.readdirSync(currentDir) || [];
        if (files.includes(CONFIG_FILE_NAME)) {
            console.log('File already exists.');
            return null;
        }

        shell.exec(`touch ${CONFIG_FILE_NAME}`)


        prompt().then((result) => {
            const config = Object.assign({}, BASE_CONFIG, result);
            const data = YAML.stringify(config);
            fs.writeFile(CONFIG_FILE, data, (err) => {
                if (err) throw new Error('Problem writing to disk.');
                console.log('Config file created! 🎉🎉');
            });
            return config;
        });
    },
};

