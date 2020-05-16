
const redisHost = process.env.REDIS_HOST;
const expireInSecs = process.env.EXPIRE_IN_SECS;

exports.refresh = async (event, context) => {
    const asyncRedis = require("async-redis");
    // const client = asyncRedis.createClient({host: 'bi-cache-server.i1c2dr.ng.0001.use1.cache.amazonaws.com'});
    const client = asyncRedis.createClient({host: redisHost});

    client.on("error", function (err) {
        console.log("Error " + err);
    });

    const expire = async (key) => {
        console.log(key);
        const ll = await client.ttl(key);
        if (ll < parseInt(<string>expireInSecs, 10) || 0) {
            console.log(`expiring key -> ${key}`);
            await client.expire(key, 1);
        }
    };

    const asyncBlock = async () => {
        const keys = await client.keys('SQL_QUERY_RESULT_CUBEJS_APP*');

        const promises = keys.map(expire);
        await Promise.all(promises);
    };

    await asyncBlock();
    context.done(null, event);
};
