import chai, {expect} from 'chai';
import {createSandbox} from 'sinon';
import sinonChai from 'sinon-chai';
import cls from 'cls-hooked';

import MongodbTransactionFactory from './MongodbTransactionFactory';

chai.use(sinonChai);

const sandbox = createSandbox();

describe('MongodbTransactionFactory', () => {
    let mockIoC;
    let mockMongodb;
    let transactionStub;
    let queryStub;
    let clsNamespace;
    let clsFactoryStub;
    let mongodbFactoryStub;

    beforeEach(() => {
        clsNamespace = cls.createNamespace('test');
        transactionStub = sandbox.stub();
        mockMongodb = {
            startSession: () => {
                return {
                    startTransaction: () => {
                        clsNamespace.set('transaction', transactionStub);
                        transactionStub();
                    },
                    commitTransaction: () => {

                    },
                    abortTransaction: () => {

                    },
                    endSession: () => {

                    }
                };
            }
        };
        clsFactoryStub = sandbox.stub().returns(clsNamespace);
        mongodbFactoryStub = sandbox.stub().returns(mockMongodb);
        mockIoC = {
            getConnector: (name) => {
                // we need to wrap the stub calls since sinon doesn't allow verifying number of calls with given args
                if (name === 'cls') {
                    return clsFactoryStub();
                }
                if (name === 'mongodb') {
                    return mongodbFactoryStub();
                }
                return undefined;
            },
        };
        queryStub = sandbox.stub();
    });

    it('returns a function which calls the query', async () => {
        await clsNamespace.run(() => MongodbTransactionFactory({container: mockIoC})(queryStub));
        expect(queryStub).to.have.been.calledOnce;
        expect(clsFactoryStub).to.have.been.calledOnce;
        expect(mongodbFactoryStub).to.have.been.calledOnce;
    });

    it('calls the query function inside of the transaction', async () => {
        await clsNamespace.run(() => MongodbTransactionFactory({container: mockIoC})(queryStub));
        expect(transactionStub).to.have.been.calledOnce;
    });

    it('only creates one transaction when there are nested transaction calls', async () => {
        await clsNamespace.run(() => {
            MongodbTransactionFactory({container: mockIoC})(() =>
                MongodbTransactionFactory({container: mockIoC})(() =>
                    MongodbTransactionFactory({container: mockIoC})(() =>
                        MongodbTransactionFactory({container: mockIoC})(queryStub))));
        });
        expect(transactionStub).to.have.been.calledOnce;
        expect(mongodbFactoryStub).to.have.been.calledOnce;
    });
});
