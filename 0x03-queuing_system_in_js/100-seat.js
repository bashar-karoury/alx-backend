import { createClient } from 'redis';
import express from 'express';
import kue from 'kue';
import { promisify } from 'util';

const client = createClient();
client.connect();


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