// @flow
import boom from 'boom';
import uuidv4 from 'uuid/v4';
import type { Interface as PubSubConnector } from '../../connectors/pubsub/PubSubConnector';

export type MessageType = {
    id: string,
    commandData: Object,
    userId: string,
};

export default class BaseCommand {
    commandData: Object;

    userId: string;

    id: string;

    ioc: Object;

    pubsub: PubSubConnector;

    constructor(commandData, ioc: Object) {
        this.commandData = commandData;

        if (ioc) {
            this.pubsub = ioc.getConnector('pubsub');
        }
    }

    restoreFromMessage({
        id, commandData, userId,
    }: MessageType) {
        this.id = id;
        this.commandData = commandData;
        this.userId = userId;
    }

    updateCommandData(newCommandData: Object) {
        this.commandData = {
            ...this.commandData,
            ...newCommandData,
        };
    }

    toJSON() {
        return {
            id: this.id,
            commandData: this.commandData,
            userId: this.userId,
            commandDefinitionID: this.commandDefinitionID,
        };
    }

    get commandDefinitionID(): string {
        throw new Error('The id method was not implemented in the command class for the specific type');
    }

    get topic(): string {
        throw new Error('Topic getter has not been initiated!');
    }

    do() {
        throw new Error('The do method was not implemented in the command class for the specific type');
    }

    undo() {
        throw new Error('The undo method was not implemented in the command class for the specific type');
    }

    shouldStore(): boolean {
        return true;
    }

    eventDispatcher(type: string, eventData: any) {
        console.log('*************** EVENT DIPATCHER ***************');
        if (this.pubsub) {
            const check = (typeToCheck: string, fn: Function) => {
                if (typeToCheck === type) {
                    fn({ pubsub: this.pubsub }, { body: eventData });
                }
            };
            this.onEventDispatcher({ check });
        } else {
            throw boom.internal('There is not a PubSub component enabled');
        }
    }

    // eslint-disable-next-line no-unused-vars
    onEventDispatcher({ check }: { check: Function }) {}

    prepareMessage(data: {}) {
        return {
            id: uuidv4(),
            commandDefinitionID: this.commandDefinitionID,
            commandData: this.commandData,
            ...data,
        };
    }
}
