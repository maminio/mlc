// @flow

import Mongoose from 'mongoose';
import { interfaces } from 'inversify';

export const ProvisionStatus = {
    INITIALIZED: 'INITIALIZED',
    INITIALIZING: 'INITIALIZING',
    INSTALLING_PACKAGES: 'INSTALLING_PACKAGES',
    CREATING_CONTAINER: 'CREATING_CONTAINER',
    CREATING_DOCKERFILE: 'CREATING_DOCKERFILE',
    INVALID_DOCKERFILE: 'INVALID_DOCKERFILE',
    PUSHING_CONTAINER: 'PUSHING_CONTAINER',
    DEPLOYED: 'DEPLOYED',
    DEPLOYING: 'DEPLOYING',
    DESTROYED: 'DESTROYED',
    DESTROYING: 'DESTROYING',
    DEPRECATED: 'DEPRECATED',
    ERROR: 'ERROR',
};

export default (context: interfaces.Context) => {
    const mongooseConnection: Mongoose = context.container.getConnector('mongodb');
    const DeploymentSchema = Mongoose.Schema({
        owner: {
            type: Mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            unique: true,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        version: {
            type: String,
        },
        language: {
            type: String,
        },
        framework: {
            type: String,
        },
        shortDescription: {
            type: String,
        },
        tags: [{
            type: String,
        }],

        access: {
            type: String,
            enum: ['PRIVATE', 'PUBLIC'],
            default: 'PRIVATE',
        },
        inference: {
            entryFile: {
                type: String,
            },
            args: [{
                type: String,
            }],
            outputPath: {
                type: String,
            },
            output_regex: {
                type: String,
            },
            output_mime: [{
                type: String,
            }],
            preRunScripts: [{
                type: String,
            }],
            inputType: [{
                type: String,
            }],
        },
        package: {
            type: {
                type: String,
            },
            requirements_file: {
                type: String,
            },
        },
        repository: {
            type: String,
        },
        status: {
            lastDeploy: {
                type: String,
            },
            current: {
                type: String,
                default: 'INITIALIZED',
                enum: [
                    'INITIALIZED', 'INITIALIZING',
                    'CREATING_DOCKERFILE', 'INVALID_DOCKERFILE', 'CREATING_CONTAINER', 'PUSHING_CONTAINER',
                    'INSTALLING_PACKAGES',
                    'DEPLOYED', 'DEPLOYING',
                    'DESTROYED', 'DESTROYING',
                    'DEPRECATED',
                    'ERROR'],
            },
        },
        model: {
            path: {
                type: String,
            },
            fileType: {
                type: String,
                enum: ['.zip'],
                default: '.zip',
            },

            exec_cmd: {
                type: String,
            },
            command: {
                type: String,
            },
            output: {
                path: {
                    type: String,
                },
                type: {
                    type: String,
                },
            },
            input: {
                download_destination: {
                    type: String,
                },
                type: {
                    type: String,
                },
            },
        },
        image: {
            type: String,
        },
    }, { timeStamp: true });
    return mongooseConnection.model('DeploymentModel', DeploymentSchema);
};

export type Interface = Mongoose.Model;
