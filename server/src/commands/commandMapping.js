import {
    CREATE_NEW_USER_COMMAND_DEFINITION_ID,
    DESTROY_SERVICE_COMMAND_DEFINITION_ID,
    PROVISION_NEW_SERVICE_COMMAND_DEFINITION_ID,
    PROVISIONER_LOG_STREAM_COMMAND_DEFINITION_ID,
    UPDATE_USER_COMMAND_DEFINITION_ID,
    PROVISION_STATUS_UPDATE_COMMAND_DEFINITION_ID,
    UPDATE_RUN_COMMAND_DEFINITION_ID
} from 'src/commands/command-ids';
import { CreatedNewUserCommandHandler } from 'src/commands/user/CreatedNewUser';
import { UpdateUserCommandHandler } from 'src/commands/user/UpdateUser';
import { ProvisionNewServiceCommandHandler } from 'src/commands/provisioner/ProvisionNewService';
import { ProvisionerLogStreamCommandHandler } from 'src/commands/provisioner/ProvisionerLogStream';
import { ProvisionStatusUpdateCommandHandler } from 'src/commands/provisioner/ProvisionStatusUpdate';
import { UpdateRunCommandHandler } from 'src/commands/run/UpdateRun';
// Based on each micro service we can identify what keys to process.

const UserCRD = {
    [CREATE_NEW_USER_COMMAND_DEFINITION_ID]: CreatedNewUserCommandHandler,
    [UPDATE_USER_COMMAND_DEFINITION_ID]: UpdateUserCommandHandler,
};


const Provisioner = {
    [PROVISION_NEW_SERVICE_COMMAND_DEFINITION_ID]: ProvisionNewServiceCommandHandler,
    [DESTROY_SERVICE_COMMAND_DEFINITION_ID]: ProvisionNewServiceCommandHandler,
    [PROVISIONER_LOG_STREAM_COMMAND_DEFINITION_ID]: ProvisionerLogStreamCommandHandler,
};

const Run = {
    [UPDATE_RUN_COMMAND_DEFINITION_ID]:UpdateRunCommandHandler
}

export const user = {

};


export const api = {
    [PROVISION_STATUS_UPDATE_COMMAND_DEFINITION_ID]: ProvisionStatusUpdateCommandHandler,
    ...Run,
};


export const worker_provisioner = {
    ...Provisioner,
};


