import { axios } from './utils';

export const listDeployments = async (data) => {
    try {
        return await axios.get('/deployment', data);
    } catch (e) {
        console.log({ e });
    }
};


export const getDeployment = async (deployment) => {
    try {
        return await axios.get(`/deployment/${deployment}`);
    } catch (e) {
        console.log({ e });
    }
};

export const createDeployment = async (data) => {
    try {
        return await axios.post(`/deployment`, data);
    } catch (e) {
        console.log({ e });
    }
};

export const updateDeployment = async (deployment, data) => {
    try {
        return await axios.post(`/deployment/update/${deployment}`, data);
    } catch (e) {
        console.log({ e });
    }
};

export const deploy = async (deployment, data) => {
    try {
        return await axios.post(`/deployment/deploy/${deployment}`, data);
    } catch (e) {
        console.log({ e });
    }
};
