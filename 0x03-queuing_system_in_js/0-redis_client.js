import { createClient } from 'redis';


const client = createClient();
(async function() {
    try {
        await client.connect();
        console.log('Redis client connected to the server');
    } catch (error) {
        console.log('Redis client not connected to the server: ', error);
    }
})();