import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {createSandbox, mock} from 'sinon';

require('sinon-mongoose');
import sinonChai from 'sinon-chai';

import {createTestIoC} from '../../../src-test/ioc';

chai.use(chaiAsPromised);
chai.use(sinonChai);

chai.should();

const sandbox = createSandbox();

describe('Run domain', () => {
    let iocContainer;
    let transaction;
    let RunDomain;

    beforeEach(() => {
        iocContainer = createTestIoC('client');
        transaction = sandbox.stub().callsArg(0);
        iocContainer.rebindFactory('transaction', () => transaction);
        RunDomain = iocContainer.getDomain('run');
    });

    afterEach(() => {
        sandbox.restore();
    });

    context('getRunId', () => {
        let findByIdStub, populatedFindByIdStub;

        beforeEach(() => {
            findByIdStub = mock(iocContainer.getModel('run')).expects('findById');
            populatedFindByIdStub = findByIdStub.chain('populate').chain('populate');
        });

        it('query for a run by Id', async () => {
            populatedFindByIdStub.resolves({
                _id: '123'
            });
            await RunDomain.getRunById('123');
            expect(findByIdStub).to.have.been.calledWithExactly('123');
        });

        it('return a run with provided Id', async () => {
            populatedFindByIdStub.resolves({
                _id: '123'
            });
            const run = await RunDomain.getRunById('123');
            expect(run).to.deep.equal({
                _id: '123'
            });
        });
    });

    context('getRuns', () => {
        let findStub, populatedFindStub;

        beforeEach(() => {
            findStub = mock(iocContainer.getModel('run')).expects('find');
            populatedFindStub = findStub.chain('populate').chain('populate');
        });

        it('query for a list of runs', async () => {
            populatedFindStub.resolves([{
                _id: '123'
            }, {
                _id: '1234'
            }]);
            await RunDomain.getRuns();
            expect(findStub).to.have.been.calledWithExactly({});
        });

        it('returns a list of runs', async () => {
            populatedFindStub.resolves([{
                _id: '123',
                title: 'GAN',
            }, {
                _id: '456',
                title: 'CNN',
            }]);
            const runs = await RunDomain.getRuns();
            expect(runs.length).to.equal(2);
            expect(runs).to.deep.equal([{
                _id: '123',
                title: 'GAN',
            }, {
                _id: '456',
                title: 'CNN',
            }]);
        });
    });
});
