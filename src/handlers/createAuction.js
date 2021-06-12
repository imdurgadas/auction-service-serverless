import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import commonMiddleware from '../middlewares/common';
import createError from 'http-errors';
import createAuctionSchema from '../schemas/createAuction';
import validator from '@middy/validator';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Create Auction handler
const createAuction = async (event, context) => {
    const { title } = event.body;
    const now = new Date();
    const endDate = new Date();
    endDate.setHours(now.getHours() + 1);

    const auction = {
        id: uuid(),
        title,
        createdAt: now.toISOString(),
        endingAt: endDate.toISOString(),
        status: 'OPEN',
        highestBid: {
            amount: 0,
        },
        isTrial: 'false',
    };

    try {
        await dynamoDB
            .put({
                TableName: process.env.AUCTIONS_TABLE_NAME,
                Item: auction,
            })
            .promise();
    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError(error);
    }

    return {
        statusCode: 201,
        body: JSON.stringify(auction),
    };
};

export const handler = commonMiddleware(createAuction).use(
    validator({
        inputSchema: createAuctionSchema,
    })
);
