// @flow
import { getBoomErrorMessage } from './utils';

class CommandError {
    command: any

    error: any

    constructor(command: any, error: any) {
        this.command = command.toJSON();
        this.error = getBoomErrorMessage(error);
    }
}

export default CommandError;
