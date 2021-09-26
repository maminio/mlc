
import chai, { expect } from 'chai';
import { createSandbox } from 'sinon';
import sinonChai from 'sinon-chai';
import asPromised from 'chai-as-promised';

import RedisOrderedSetCommandBuilder from './RedisOrderedSetCommandBuilder';

chai.use(sinonChai);
chai.use(asPromised);

const sandbox = createSandbox();

describe('RedisOrderedSetCommandBuilder', () => {
    let mockRedis;
    let mockRedisMultiCmd;
    let mockRedisMultiExecCmd;
    let clock;

    beforeEach(() => {
        clock = sandbox.useFakeTimers();
        mockRedisMultiExecCmd = sandbox.stub();
        mockRedisMultiCmd = sandbox.stub().returns({ exec: mockRedisMultiExecCmd });
        mockRedis = {
            multi: mockRedisMultiCmd,
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('can be instantiated', () => {
        expect(new RedisOrderedSetCommandBuilder(mockRedis)).to.be.ok;
    });

    it('run calls through to redis', async () => {
        mockRedisMultiExecCmd.callsArgWith(0, undefined, []);
        await new RedisOrderedSetCommandBuilder(mockRedis).run();
        expect(mockRedisMultiCmd).to.have.been.calledOnce;
        expect(mockRedisMultiCmd).to.have.been.calledWithExactly([]);
        expect(mockRedisMultiExecCmd).to.have.been.calledOnce;
    });

    it('resolves the promise with results from Redis', async () => {
        mockRedisMultiExecCmd.callsArgWith(0, undefined, ['foo', 'bar']);
        const result = await new RedisOrderedSetCommandBuilder(mockRedis).run();
        expect(result).to.deep.equal(['foo', 'bar']);
    });

    it('rejects the promise if there was an error', async () => {
        mockRedisMultiExecCmd.callsArgWith(0, 'boom', ['foo', 'bar']);
        await expect(new RedisOrderedSetCommandBuilder(mockRedis).run()).to.eventually.be.rejectedWith('boom');
    });

    context('value', () => {
        it('adds the correct command to the command list', async () => {
            mockRedisMultiExecCmd.callsArgWith(0, undefined, []);
            await new RedisOrderedSetCommandBuilder(mockRedis)
                .value('some-list', 'some-field')
                .run();
            expect(mockRedisMultiCmd).to.have.been.calledWithExactly([
                ['zscore', 'some-list', 'some-field'],
            ]);
        });
    });

    context('put', () => {
        it('adds the correct command to the command list', async () => {
            mockRedisMultiExecCmd.callsArgWith(0, undefined, []);
            await new RedisOrderedSetCommandBuilder(mockRedis)
                .put('some-list', 'some-field', 'some-value')
                .run();
            expect(mockRedisMultiCmd).to.have.been.calledWithExactly([
                ['zadd', 'some-list', 'some-value', 'some-field'],
            ]);
        });
    });

    context('increment', () => {
        it('adds the correct command to the command list', async () => {
            mockRedisMultiExecCmd.callsArgWith(0, undefined, []);
            await new RedisOrderedSetCommandBuilder(mockRedis)
                .increment('some-list', 'some-field')
                .run();
            expect(mockRedisMultiCmd).to.have.been.calledWithExactly([
                ['zincrby', 'some-list', 1, 'some-field'],
            ]);
        });
    });

    context('remove', () => {
        it('adds the correct command to the command list', async () => {
            mockRedisMultiExecCmd.callsArgWith(0, undefined, []);
            await new RedisOrderedSetCommandBuilder(mockRedis)
                .remove('some-list', 'some-field')
                .run();
            expect(mockRedisMultiCmd).to.have.been.calledWithExactly([
                ['zrem', 'some-list', 1, 'some-field'],
            ]);
        });
    });

    context('removeOldEntries', () => {
        it('adds the correct command to the command list', async () => {
            clock.tick(123000);
            mockRedisMultiExecCmd.callsArgWith(0, undefined, []);
            await new RedisOrderedSetCommandBuilder(mockRedis)
                .removeOldEntries('some-list')
                .run();
            expect(mockRedisMultiCmd).to.have.been.calledWithExactly([
                ['zremrangebyscore', 'some-list', '-inf', 123],
            ]);
        });
    });
});
