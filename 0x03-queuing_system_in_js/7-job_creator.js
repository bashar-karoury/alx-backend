import { createClient } from 'redis';
import kue from 'kue';
const jobs = [
    {
      phoneNumber: '4153518780',
      message: 'This is the code 1234 to verify your account'
    },
    {
      phoneNumber: '4153518781',
      message: 'This is the code 4562 to verify your account'
    },
    {
      phoneNumber: '4153518743',
      message: 'This is the code 4321 to verify your account'
    },
    {
      phoneNumber: '4153538781',
      message: 'This is the code 4562 to verify your account'
    },
    {
      phoneNumber: '4153118782',
      message: 'This is the code 4321 to verify your account'
    },
    {
      phoneNumber: '4153718781',
      message: 'This is the code 4562 to verify your account'
    },
    {
      phoneNumber: '4159518782',
      message: 'This is the code 4321 to verify your account'
    },
    {
      phoneNumber: '4158718781',
      message: 'This is the code 4562 to verify your account'
    },
    {
      phoneNumber: '4153818782',
      message: 'This is the code 4321 to verify your account'
    },
    {
      phoneNumber: '4154318781',
      message: 'This is the code 4562 to verify your account'
    },
    {
      phoneNumber: '4151218782',
      message: 'This is the code 4321 to verify your account'
    }
  ];

const push_notification_code =  kue.createQueue();
for (const obj of jobs){
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
    job.on('progress', (progress) => {
        console.log(`Notification job ${job.id} ${progress}% complete`);
      });
}
