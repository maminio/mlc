import { to } from 'bin/apis/utils';
import {
    runs as fetchRuns,
} from 'bin/apis/run';

module.exports = {

    command: 'list',
    aliases: ['ls', 'list'],
    describe: 'Lists all deployments on mlc platform.',


    handler: async (argv) => {
        const [error, runs] = await to(fetchRuns());
        const table = runs.map(item => ({
            ID: item._id,
            Date: item.creationDate,
            Status: item.status,
            Result: item.result,
        }));
        console.table(table);
    },
};
