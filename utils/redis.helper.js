const { createClient } = require('redis');

const client = createClient({
    url: 'redis://localhost:6379',
});
// const RedisClustr = require('redis-clustr');
// const RedisClient = require('redis');
// let redis = new RedisClustr({
//     servers: [{
//         host: 'localhost',
//         port: 6380,
//     }],
//     slotInterval: 1000, // default: none. Interval to repeatedly re-fetch cluster slot configuration
//     maxQueueLength: 100, // default: no limit. Maximum length of the getSlots queue (basically number of commands that can be queued whilst connecting to the cluster)
//     queueShift: false, // default: true. Whether to shift the getSlots callback queue when it's at max length (error oldest callback), or to error on the new callback
//     wait: 5000, // default: no timeout. Max time to wait to connect to cluster before sending an error to all getSlots callbacks
//     slaves: 'share', // default: 'never'. How to direct readOnly commands: 'never' to use masters only, 'share' to distribute between masters and slaves or 'always' to  only use slaves (if available)
//     createClient: function (port, host) {
//         // this is the default behaviour
//         return RedisClient.createClient(port, host);
//     },
//     redisOptions: {
//         // options passed to the node_redis client https://github.com/NodeRedis/node_redis#options-is-an-object-with-the-following-possible-properties
//         retry_max_delay: 500
//         // etc
//     }
// });

// redis.on("connect", function () {
//     console.log("connected redis");
// });
// redis.on("error", function (err) {
//     console.log("connected redis", err);
// });


module.exports = {
    init: async () => {
        console.log("========")
        client.on('error', (err) => console.log('Redis Client Error', err));
        client.on('connect', (info) => console.log('Redis Connected'));
        await client.connect()
        // console.log(redis.connected)
    },
    getValue: async (key) => {
        console.log("getValue", key)
        const values = await client.lRange(key, 0, 0);
        return values ? values[0] : null
        // return new Promise((resolve, reject) => {
        //     console.log("sdasdasd")
        //     redis.get(key, function (err, reply) {
        //         console.log("redis.set ", reply);
        //         resolve(reply)
        //     });
        // })
    },
    setValue: async (key, value) => {
        const existsValue = await client.lRange(key, 0, 0);
        if (existsValue && existsValue.length > 0 && existsValue[0] === value) {
            return null;
        }
        const result =  await client.rPush(key, value);
        client.expireAt(key,)
        // return new Promise((resolve, reject) => {
        //     redis.set(key, value, function (err, reply) {
        //         console.log("redis.set ", reply);
        //         resolve(reply)
        //     });
        // })
    }
}