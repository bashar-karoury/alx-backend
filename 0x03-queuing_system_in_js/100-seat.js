import { createClient } from 'redis';
import express from 'express';
import kue from 'kue';
import { promisify } from 'util';

const client = createClient();
client.connect();




// Create a Redic client:

// Create a function reserveSeat, that will take into argument number, and set the key available_seats with the number
// Create a function getCurrentAvailableSeats, it will return the current number of available seats (by using promisify for Redis)
// When launching the application, set the number of available to 50
// Initialize the boolean reservationEnabled to true - it will be turn to false when no seat will be available

const reserveSeat = (number) => {
    client.set('available_seats', number);
};

const getCurrentAvailableSeats = async () => {

    return await client.get('available_seats');
};

client.on('connect', () => {
    console.log('Connected to Redis');
    reserveSeat(50);
});

let reservationEnabled = true;

const app = express();
const PORT = 1245;

app.get('/available_seats', async function(req, res){
    const available_seats = await getCurrentAvailableSeats();
    res.json({"numberOfAvailableSeats": available_seats});
});


// Add the route GET /reserve_seat that:

// Returns { "status": "Reservation are blocked" } if reservationEnabled is false
// Creates and queues a job in the queue reserve_seat:
// Save the job and return:
// { "status": "Reservation in process" } if no error
// Otherwise: { "status": "Reservation failed" }
// When the job is completed, print in the console: Seat reservation job JOB_ID completed
// When the job failed, print in the console: Seat reservation job JOB_ID failed: ERROR_MESSAGE
// bob@dylan:~$ curl localhost:1245/reserve_seat ; echo ""
// {"status":"Reservation in process"}



const reservationQueue =  kue.createQueue(({name: 'reservation'}));
app.get('/reserve_seat',async function(req, res){
    if (!reservationEnabled){
        res.json({ "status": "Reservation are blocked" });
    }
    else{
        const job = reservationQueue.create('reservation').save((err) => {
            if (err) {
                res.json({ "status": "Reservation failed" });
            }
        });
        job.on('complete', () => {
            console.log(`Seat reservation job ${job.id} completed`);
          });
          job.on('failed', (err) => {
            console.log(`Seat reservation job ${job.id} failed`);
           
          });
        res.json({"status":"Reservation in process"});
    }
});








// Add the route GET /process that:

// Returns { "status": "Queue processing" } just after:
// Process the queue reserve_seat (async):
// Decrease the number of seat available by using getCurrentAvailableSeats and reserveSeat
// If the new number of available seats is equal to 0, set reservationEnabled to false
// If the new number of available seats is more or equal than 0, the job is successful
// Otherwise, fail the job with an Error with the message Not enough seats available
// bob@dylan:~$ curl localhost:1245/process ; echo ""
// {"status":"Queue processing"}
// bob@dylan:~$ 
// bob@dylan:~$ curl localhost:1245/available_seats ; echo ""
// {"numberOfAvailableSeats":"49"}



app.get('/process', async function(req, res){
    
    reservationQueue.process('reservation', async function(job, done){
        console.log('processing');
        const available_seats = await getCurrentAvailableSeats();
        if (available_seats > 1){
            // decrease by 1
            reserveSeat(available_seats - 1);
            // set flag to false if no of seats = 0
            if ((available_seats - 1) === 0){
                reservationEnabled = false;
            }
            done();
        }
        else{
            done(new Error('Not enough seats available'));
        }
        
    });
    res.json({"status": "Queue processing" });
});


app.listen(PORT);