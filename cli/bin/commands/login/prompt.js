// @flow

import { get } from 'lodash';
import { login } from '../../apis/auth';
const store = require('../../utils');

const inquirer = require('inquirer');
const chalk = require('chalk');
const path = require('path');

module.exports = () => {
    const questions = [
        {
            type: 'input',
            name: 'username',
            message: chalk.blue('Username'),
            default: '',
        },
        {
            type: 'password',
            name: 'password',
            message: 'password',
            default: '',
        },

    ];

    return inquirer.prompt(questions)
        .then(async (answers) => {
            try {
                const results = await login(answers);
                const token = get(results, 'data.token', '');
                const refreshToken = get(results, 'data.refreshToken', '');
                store.save('token', token);
                store.save('refreshToken', refreshToken);
                console.log('Login success! ✅');
            } catch (e) {
                console.log('Failed to login!');
            }

            return answers;
        });
};
