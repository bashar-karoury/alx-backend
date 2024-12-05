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


(async function () {
    await client.hSet('HolbertonSchools', {
        Portland: 50,
        Seattle: 80,
        'New York': 20,
        Bogota: 20,
        Cali: 40,
        Paris: 2
    });
    const result = await client.hGetAll('HolbertonSchools');
    console.log(result);
})();