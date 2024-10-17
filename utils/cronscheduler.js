import cron from 'node-cron';
import AWS from 'aws-sdk';
import mongoose from 'mongoose';
import Data from '../schema/schema.js';
import crypto from 'crypto';

AWS.config.update({
    region: 'ap-south-1', 
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const sqs = new AWS.SQS();

const startCronJob = () => {
    cron.schedule('* * * * *', async () => {
        const params = {
            QueueUrl: process.env.SQS_QUEUE_URL,
            MaxNumberOfMessages: 10,
            WaitTimeSeconds: 20,
        };

        console.log(params);

        try {
            const data = await sqs.receiveMessage(params).promise();
          

            if (data.Messages) {
                for (const message of data.Messages) {
                    const body = JSON.parse(message.Body);
                    const record = await Data.findById(body.id);
                    

                    // Ensure calculatedField exists before accessing it
                    if (record) {
                        if (!record.calculatedField) {
                            record.calculatedField = {}; // Initialize if it doesn't exist
                        }
                        // Perform calculations (e.g., word count and hash)
                        record.calculatedField.wordCount = record.description.split(' ').length;
                        record.calculatedField.hashtag = crypto.createHash('sha256').update(record.title).digest('hex');
                        await record.save();
                    }
                    console.log("-----------------------record 2", record);

                    // Delete the message from SQS after processing
                    await sqs.deleteMessage({
                        QueueUrl: process.env.SQS_QUEUE_URL,
                        ReceiptHandle: message.ReceiptHandle,
                    }).promise();
                }
            }
        } catch (err) {
            console.error(err.message);
        }
    });
};

export default startCronJob;