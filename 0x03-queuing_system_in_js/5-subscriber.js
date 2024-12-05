import { createClient} from 'redis';

const client = createClient();
(async function() {
    try {
        await client.connect();
        console.log('Redis client connected to the server');
    } catch (error) {
        console.log('Redis client not connected to the server: ', error);
    }
    const channel = 'holberton school channel';
    const listener = async (message, channel) => {
        console.log('Message arrived');
        console.log(message, channel)
        if (message === 'KILL_SERVER') {
            await client.unsubscribe(channel, listener);
            await client.quit();
        }
    };
    await client.subscribe(channel, listener);
})();