import { CONFIG_FILE, to } from 'bin/apis/utils';
import path from 'path';
import {
    getDeployment, createDeployment, updateDeployment, deploy,
} from 'bin/apis/deployment';
import { get } from 'lodash';

const yaml = require('js-yaml');
const fs = require('fs');

module.exports = {

    command: 'apply',
    aliases: ['apply'],
    describe: 'Create new deployment or update an existing one',

    builder: {
        file: {
            alias: 'f',
            describe: 'Deployment config file path',
            // demandOption: true
        },
    },

    handler: async (argv) => {
        /*
        * Get the config file
        * Check if it's available in backend
        * If not create otherwise update.
        * Upload files
        * */
        let configs;
        try {
            configs = yaml.safeLoad(
                fs.readFileSync(path.resolve(process.cwd(), CONFIG_FILE),
                    'utf8'),
            );
        } catch (e) {
            console.log('Error parsing config yaml.');
        }
        console.log({ configs })
        const name = get(configs, 'name', 'empty');
        const [getDeployError, { data: deployment }] = await to(getDeployment(name));
        if (getDeployError) {
            console.log('🛑 Error communicating with backend.');
        }
        if (deployment) {
            console.log('🚀 Updating deployment...');
            console.log('Please wait...');
            const [updateDeployError, updatedDeployment] = await to(updateDeployment(name, configs));

            if (updateDeployError) {
                console.log('🛑 Error updating config file.');
                return null;
            }
            console.log('✅ Deployment Updated');
        } else {
            console.log('🐳 Creating new deployment...');
            console.log('Please wait...');

            const [createDeployError, newDeployment] = await to(createDeployment(configs));
            // console.log({ createDeployError, newDeployment });
            if (createDeployError) {
                console.log('🛑 Error creating deployment!');
                return null;
            }
            console.log('✅ Deployment Created');
        }
        console.log('Deployment in process.');
        const [deployedError, deployed] = await to(deploy(name));
        if(deployedError){
            console.log('🛑 Error creating running deployment!');
            return null;
        }
        console.log('✅ Deployment building.');
        return null;
    },
};
