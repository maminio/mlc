// @flow

import {interfaces} from 'inversify';
import TransactionHelper from './TransactionHelper';

import withinClsContext from '../withinClsContext';
import type {CLSNamespace} from 'flow-typed/types';

/* Any factory that uses/returns things that are specific to a request context must use 'withinClsContext' */
export default (context: interfaces.Context) =>
    withinClsContext(context, async (clsNamespace: CLSNamespace, queryFn: Function) => {
        const currentTransaction = clsNamespace.get('transaction');
        if (currentTransaction) {
            return queryFn(currentTransaction);
        }
        return await TransactionHelper(queryFn, context.container.getConnector('mongodb'));
    });
