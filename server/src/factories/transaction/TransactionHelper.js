export default async (wrapper, mongoose) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const value = await execute(wrapper, session);
        await commit(session);
        return value;
    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }
};

async function execute(wrapper, session) {
    try {
        return await wrapper(session);
    } catch (err) {
        if (err.errorLabels && err.errorLabels.indexOf('TransientTransactionError') >= 0) {
            await execute(wrapper, session);
        } else {
            throw err;
        }
    }
}

async function commit(session) {
    try {
        await session.commitTransaction();
    } catch (err) {
        if (err.errorLabels && err.errorLabels.indexOf('UnknownTransactionCommitResult') >= 0) {
            await commit(session);
        } else {
            throw err;
        }
    }
}
