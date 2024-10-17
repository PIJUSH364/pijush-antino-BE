import Data from '../schema/schema.js';
import AWS from 'aws-sdk';
import crypto from 'crypto';

// Initialize SQS
const sqs = new AWS.SQS();

export const getAllData = async (req, res) => {
    try {
        const dataList = await Data.find();
        res.json(dataList);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const generateData = async (req, res) => {
    const { title, description } = req.body;
    try {
        const newData = new Data({ title, description });
        await newData.save();

        // Send message to SQS
        const params = {
            MessageBody: JSON.stringify({ id: newData._id }),
            QueueUrl: process.env.SQS_QUEUE_URL,
        };
        await sqs.sendMessage(params).promise();

        res.status(201).json(newData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const checkCalculationStatus = async (req, res) => {
    const { id } = req.params;
    try {
        const record = await Data.findById(id);
        if (record) {
            const status = record.calculatedField && record.calculatedField.wordCount > 0
                ? 'Calculation completed'
                : 'Pending calculation';
            res.json({ id, status, calculatedField: record.calculatedField });
        } else {
            res.status(404).json({ error: 'Record not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
