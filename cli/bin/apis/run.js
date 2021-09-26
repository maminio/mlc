import { axios } from './utils';

export const createRun = async (deploy, data) => axios.post(`/run/${deploy}`, data);

export const runs = async () => {
    try {
        const { data: { result } } = await axios.get('/run');
        return result;
    } catch (e) {
        throw new Error(e);
    }
};
