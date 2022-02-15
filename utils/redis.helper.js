const { createClient, commandOptions } = require('redis');

const client = createClient(6379, 'localhost');

module.exports = {
    init: async () => {
        client.on('error', (err) => console.log('Redis Client Error', err));
        client.on('connect', (info) => console.log('Redis Connected'));
        await client.connect();
    },
    getValue: async (key) => {
        const values = await client.lRange(key, 0, 0);
        return values ? values[0] : null
    },
    setValue: async (key, value) => {
        const existsValue = await client.lRange(key, 0, 0);
        if (existsValue && existsValue.length > 0 && existsValue[0] === value) {
            return null;
        }
        return client.rPush(key, value);
    }
}