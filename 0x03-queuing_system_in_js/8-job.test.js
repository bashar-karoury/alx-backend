import kue from 'kue';

import createPushNotificationsJobs from './8-job.js';

import 'mocha';
import 'chai';
import { expect } from 'chai';

const queue = kue.createQueue();
queue.testMode.enter(true);

const list = [
    {
        phoneNumber: '4153518780',
        message: 'This is the code 1234 to verify your account'
    }
];
describe('Testing createPushNotificationsJobs', function(){


    after(() => {
        queue.testMode.exit();  // Exit test mode after tests
    });

    it('Test if first arg is not an array', function(){
        
        expect(() => createPushNotificationsJobs(1, queue)).to.throw('Jobs is not an array');

    });
    it('Test creating one obj', function(){
        createPushNotificationsJobs(list, queue);
        expect(queue.testMode.jobs.length).to.equal(1);  // One job in memory
    }); 

});
