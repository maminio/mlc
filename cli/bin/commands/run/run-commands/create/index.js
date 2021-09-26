import { CONFIG_FILE, to } from 'bin/apis/utils';
import path from 'path';
import {
    createRun,
} from 'bin/apis/run';
import { get } from 'lodash';

const yaml = require('js-yaml');
const fs = require('fs');

module.exports = {

    command: 'create',
    aliases: ['create'],
    describe: 'Create new run',

    builder: {
        deploy: {
            alias: 'deploy',
            describe: 'Deployment name',
            type: 'string',
        },
        data: {
            alias: 'data',
            describe: 'Deployment body',
            type: 'object',
        },
    },

    handler: async (argv) => {
        if (!argv.deploy) {
            console.error('🛑Please provide a deployment name. Run deployment list');
        }
        const [error, run] = await to(createRun(argv.deploy, argv.data));
        if (get(run, 'response.status') === 404) {
            console.error('🛑Deployment not found or invalid');
            return null;
        }
    },
};
