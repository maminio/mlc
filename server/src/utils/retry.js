
export const sleep = (time = 100) => new Promise(resolve => setTimeout(() => resolve(), time));

export const retry = async (fn, action,
    { tries = 10, current = 1, interval = 100 }) => {
    try {
        if (tries > 1) {
            console.log(`Attempt ${current} to ${action}`);
        }
        const results = await fn();
        console.log(`Success to ${action}`);
        return results;
    } catch (err) {
        console.log(`Error when trying to ${action}`, err);
        if (current < tries) {
            await sleep(interval);
            await retry(fn, action, tries, current + 1, interval);
        } else {
            throw err;
        }
    }
};
