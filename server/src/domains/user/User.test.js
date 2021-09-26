import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {createSandbox, match} from 'sinon';
import sinonChai from 'sinon-chai';

import {createTestIoC} from '../../../src-test/ioc';

chai.use(chaiAsPromised);
chai.use(sinonChai);

chai.should();

const sandbox = createSandbox();

describe('User domain', () => {
    let iocContainer;
    let transaction;
    let UserDomain;

    beforeEach(() => {
        iocContainer = createTestIoC('client');
        transaction = sandbox.stub().callsArg(0);
        iocContainer.rebindFactory('transaction', () => transaction);
        UserDomain = iocContainer.getDomain('user');
    });

    afterEach(() => {
        sandbox.restore();
    });

    context('getUserById', () => {
        let findByIdStub;

        beforeEach(() => {
            findByIdStub = sandbox.stub(iocContainer.getModel('user'), 'findById');
        });

        it('query for a user by Id', async () => {
            findByIdStub.resolves({
                _id: '123'
            });
            await UserDomain.getUserById('123');
            expect(findByIdStub).to.have.been.calledWithExactly('123');
        });

        it('return a user with provided Id', async () => {
            findByIdStub.resolves({
                _id: '123'
            });
            const user = await UserDomain.getUserById('123');
            expect(user).to.deep.equal({
                _id: '123'
            });
        });
    });

    context('getUsers', () => {
        let findStub;

        beforeEach(() => {
            findStub = sandbox.stub(iocContainer.getModel('user'), 'find');
        });

        it('query for a list of users', async () => {
            findStub.resolves([{
                _id: '123'
            }, {
                _id: '1234'
            }]);
            await UserDomain.getUsers();
            expect(findStub).to.have.been.calledWithExactly({});
        });

        it('returns a list of users', async () => {
            findStub.resolves([{
                _id: '123',
                displayName: 'Angela',
            }, {
                _id: '456',
                displayName: 'Bob',
            }]);
            const users = await UserDomain.getUsers();
            expect(users.length).to.equal(2);
            expect(users).to.deep.equal([{
                _id: '123',
                displayName: 'Angela',
            }, {
                _id: '456',
                displayName: 'Bob',
            }]);
        });
    });
});
