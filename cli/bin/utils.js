import shell from 'shelljs';

const fs = require('fs');
const path = require('path');


const STORE_FILE = '.store.json';
const validate = () => {
    const currentDir = process.cwd();
    const files = fs.readdirSync(currentDir) || [];
    if (files.includes(STORE_FILE)) {
        return require(path.resolve(STORE_FILE));
    }
    shell.exec(`touch ${STORE_FILE}`);
    fs.writeFile(STORE_FILE, JSON.stringify({}), (err) => {
        if (err) throw new Error('Problem writing to disk.');
    });
    return {};
};

const writeToFile = data => fs.writeFile(STORE_FILE, JSON.stringify(data), (err) => {
    if (err) throw new Error('Problem writing to disk.');
});

export const save = (key, value) => {
    const store = validate();
    store[key] = value;
    return writeToFile(store);
};

export const remove = (key) => {
    const store = validate();
    delete store[key];
    return writeToFile(store);
};

export const getKey = (key) => {
    const store = validate();
    return store[key];
};
