// @flow

import { interfaces } from 'inversify';

import type { Interface as Redis } from '../../connectors/redis/RedisConnector';
import RedisOrderedSetCommandBuilder from './RedisOrderedSetCommandBuilder';

export default () => (context: interfaces.Context) => () => {
    const redis: Redis = context.container.getConnector('redis');
    return new RedisOrderedSetCommandBuilder(redis);
};

export type Interface = () => RedisCommandBuilder;
