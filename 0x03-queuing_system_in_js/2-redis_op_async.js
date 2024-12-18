import { createClient, print} from 'redis';


const client = createClient();
(async function() {
    try {
        await client.connect();
        console.log('Redis client connected to the server');
    } catch (error) {
        console.log('Redis client not connected to the server: ', error);
    }
})();

async function displaySchoolValue(schoolName){
    const value = await client.get(schoolName);
    console.log(value);
}

function setNewSchool(schoolName, value){
    client.set(schoolName, value, print);
}

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');