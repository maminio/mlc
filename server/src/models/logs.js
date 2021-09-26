// @flow
import Mongoose from 'mongoose';
import { interfaces } from 'inversify';

export default (context: interfaces.Context) => {
    const mongooseConnection: Mongoose = context.container.getConnector('mongodb');
    const LogsSchema = Mongoose.Schema({
        action: {
            type: String,
            required: true,
        },
        service: {
            type: Mongoose.Schema.Types.ObjectId,
            ref: 'Service',
            required: true,
        },
        date: {
            type: String,
            required: true,
        },
        events: [
            {
                event: {
                    type: String,
                    required: false,
                },
                timestamp: {
                    type: String,
                    required: false,
                },
                id: {
                    type: Mongoose.Schema.Types.ObjectId,
                    required: false,
                },
            },
        ],
    });


    return mongooseConnection.model('Logs', LogsSchema);
};

export type Interface = Mongoose.Model;
