// @flow
import { interfaces } from 'inversify';
import * as CommandMapping from 'src/commands/commandMapping';


const COMMANDS_REGISTERED = {};

const registerCommand = (id, commandClass) => {
    console.log({ id,  commandClass });
    if (!COMMANDS_REGISTERED[id]) {
        COMMANDS_REGISTERED[id] = commandClass;
    } else throw new Error(`The id ${id} is already in use by an existing command.`);
};


// Registering commands
const serviceCommands = CommandMapping[process.env.SERVICE_NAME.replace('-', '_')] || {};
Object.keys(serviceCommands).map(commandId => registerCommand(commandId, serviceCommands[commandId]));


export default (context: interfaces.Context) => ({
    createNewCommand(id: string) {
        if (COMMANDS_REGISTERED[id]) {
            const CommandBaseClass = COMMANDS_REGISTERED[id];
            return class extends CommandBaseClass {
                constructor(message: any) {
                    super(message, {
                        ioc: context.container,
                    });
                }
            };
        }
        throw new Error(`A command with the id ${id} has not been registered.`);
    },
});
