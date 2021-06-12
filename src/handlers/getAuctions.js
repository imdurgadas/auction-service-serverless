import AWS from 'aws-sdk';
import commonMiddleware from '../middlewares/common';
import createError from 'http-errors';
import validator from '@middy/validator';
import getAuctionsSchema from '../schemas/getAuctions';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Get Auctions handler
const getAuctions = async (event, context) => {
    let auctions;

    const { status } = event.queryStringParameters;
    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        IndexName: 'statusAndEndDate',
        KeyConditionExpression: '#status = :status',
        ExpressionAttributeNames: {
            '#status': 'status',
        },
        ExpressionAttributeValues: {
            ':status': status,
        },
    };

    try {
        const result = await dynamoDB.query(params).promise();

        auctions = result.Items;
    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError(error);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(auctions),
    };
};

export const handler = commonMiddleware(getAuctions).use(
    validator({
        inputSchema: getAuctionsSchema,
        useDefaults: true,
    })
);
