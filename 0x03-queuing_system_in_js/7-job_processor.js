import { createClient } from 'redis';
import kue from 'kue';

const client = createClient();
const push_notification_code_2 =  kue.createQueue({name: 'push_notification_code_2'});

const blackList = ['4153518780', '4153518781'];




function sendNotification(phoneNumber, message, job, done) {
    job.progress(0, 2);
    if (blackList.includes(phoneNumber)){
        done(new Error(`Phone number ${phoneNumber} is blacklisted`));
    }
    else{
        job.progress(1, 2);
        setTimeout(() => {
            console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
            job.progress(100);
            done();
        }, 500);
    }
}

push_notification_code_2.process('push_notification_code_2', function(job, done){
    console.log('processing');
    sendNotification(job.data.phoneNumber, job.data.message, job, done);
});
