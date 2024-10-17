// import express from 'express';
// import mongoose from 'mongoose';
// import dbConnect from './db/connect.js';
// import AWS from 'aws-sdk';
// import cron from 'node-cron';
// import dotenv from "dotenv";
// import dataRoutes from './route/dataRoute.js'; // Import the routes
// import Data from './schema/schema.js'; // Import your schema
// import crypto from 'crypto';

// dotenv.config();

// const app = express();
// app.use(express.json());

// dbConnect();
// const PORT = process.env.PORT || 8000;

// AWS.config.update({
//     region: 'ap-south-1', // Change to your region
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// });
// const sqs = new AWS.SQS();
// // Use routes
// app.use('/', dataRoutes); // Mount the routes

// // Cron job to process messages from SQS every minute
// cron.schedule('* * * * *', async () => {
//     const params = {
//         QueueUrl: process.env.SQS_QUEUE_URL,
//         MaxNumberOfMessages: 10,
//         WaitTimeSeconds: 20,
//     };

//     console.log(params);

//     try {
//         const data = await sqs.receiveMessage(params).promise();
//         console.log("-----------------data", data);

//         if (data.Messages) {
//             for (const message of data.Messages) {
//                 const body = JSON.parse(message.Body);
//                 const record = await Data.findById(body.id);
//                 console.log("--------------------->record", record);

//                 // Ensure calculatedField exists before accessing it
//                 if (record) {
//                     if (!record.calculatedField) {
//                         record.calculatedField = {}; // Initialize if it doesn't exist
//                     }
//                     // Perform calculations (e.g., word count and hash)
//                     record.calculatedField.wordCount = record.description.split(' ').length;
//                     record.calculatedField.hashtag = crypto.createHash('sha256').update(record.title).digest('hex');
//                     await record.save();
//                 }
//                 console.log("-----------------------record 2", record);

//                 // Delete the message from SQS after processing
//                 await sqs.deleteMessage({
//                     QueueUrl: process.env.SQS_QUEUE_URL,
//                     ReceiptHandle: message.ReceiptHandle,
//                 }).promise();
//             }
//         }
//     } catch (err) {
//         console.error(err.message);
//     }
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

import express from 'express';
import mongoose from 'mongoose';
import dbConnect from './db/connect.js';
import dotenv from 'dotenv';
import startCronJob from './utils/cronscheduler.js'; 

dotenv.config();

const app = express();

app.use(express.json());

dbConnect();
const PORT = process.env.PORT || 8000;

startCronJob();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});