// @flow
import Mongoose from 'mongoose';
import { interfaces } from 'inversify';

export default (context: interfaces.Context) => {
    const mongooseConnection: Mongoose = context.container.getConnector('mongodb');
    const RoleSchema = Mongoose.Schema({
        title: {
            type: String,
            required: true,
        },
        id: {
            type: String,
            unique: true,
            required: true,
        },
        permissions: {
            type: [{
                type: String,
            }],
        },
    });


    return mongooseConnection.model('Role', RoleSchema);
};

export type Interface = Mongoose.Model;
