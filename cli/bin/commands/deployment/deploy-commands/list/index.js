import { listDeployments } from 'bin/apis/deployment';

module.exports = {

    command: 'list',
    aliases: ['ls', 'list'],
    describe: 'Lists all deployments on mlc platform.',


    handler: async (argv) => {
        try {
            const { data } = await listDeployments();
            const table = data.map(item => ({
                Name: item.name,
                Description: item.description,
                Access: item.access,
                Status: item.status,
            }));
            console.table(table);
        } catch (e) {
            console.log({e })
            console.log('Error listing deployments!🛑');
        }
    },
};
