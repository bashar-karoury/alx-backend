import { createClient } from 'redis';
import kue from 'kue';

const client = createClient();
const push_notification_code =  kue.createQueue();

function sendNotification(phoneNumber, message) {
    console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
}

push_notification_code.process('notification', function(job, done){
    sendNotification(job.data.phoneNumber, job.data.message);
    done();
  });