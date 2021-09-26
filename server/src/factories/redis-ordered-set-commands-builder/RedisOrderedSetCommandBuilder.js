// @flow

import type { Interface as Redis } from '../../connectors/redis/RedisConnector';

export default class RedisOrderedSetCommandBuilder {
    commands: any[][] = []
    redis: Redis;

    constructor(redis: Redis) {
        this.redis = redis;
    }

    value(listId: string, field: string): this {
        this.commands.push(['zscore', listId, field]);
        return this;
    }

    put(listId: string, field: string, value: string | number): this {
        this.commands.push(['zadd', listId, value, field]);
        return this;
    }

    increment(listId: string, field: string): this {
        this.commands.push(['zincrby', listId, 1, field]);
        return this;
    }

    remove(listId: string, field: string): this {
        this.commands.push(['zrem', listId, 1, field]);
        return this;
    }

    removeOldEntries(listId: string): this {
        this.commands.push(['zremrangebyscore', listId, '-inf', Math.floor(Date.now() / 1000)]);
        return this;
    }

    run(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.redis.multi(this.commands).exec((err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });
    }
}
