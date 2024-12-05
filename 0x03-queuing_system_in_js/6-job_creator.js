import { createClient } from 'redis';
import kue from 'kue';

const client = createClient();
const push_notification_code =  kue.createQueue();
const obj = {
    phoneNumber: '0907164806',
    message: 'phone number string',
  };
const job = push_notification_code.create('notification', obj).save((err) => {
    if (err) {
      console.log('Error saving job:', err);
    } else {
      console.log(`Notification job created: ${job.id}`);
    }
});

// Set up event listeners for the job
job.on('complete', () => {
  console.log('Notification job completed');
});
job.on('failed', (err) => {
  console.log(`Notification job failed: ${err}`);
});
