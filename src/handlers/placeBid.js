import AWS from 'aws-sdk';
import commonMiddleware from '../middlewares/common';
import createError from 'http-errors';
import { getAuctionByid } from './getAuction';
import validator from '@middy/validator';
import placeBidSchema from '../schemas/placeBidSchema';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Place Bid handler
const placeBid = async (event, context) => {
    const { amount } = event.body;
    const { id } = event.pathParameters;

    const auction = await getAuctionByid(id);

    if (!auction.status === 'OPEN') {
        throw new createError.BadRequest(
            JSON.stringify({
                msg: `You cannot bid on a closed auction`,
            })
        );
    }

    if (amount <= auction.highestBid.amount) {
        throw new createError.BadRequest(
            JSON.stringify({
                msg: `Your bid amount should be more than ${auction.highestBid.amount}`,
            })
        );
    }

    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set highestBid.amount = :amount ',
        ExpressionAttributeValues: {
            ':amount': amount,
        },
        ReturnValues: 'ALL_NEW',
    };

    let updatedAuction;
    try {
        const result = await dynamoDB.update(params).promise();
        updatedAuction = result.Attributes;
    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError(error);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(updatedAuction),
    };
};

export const handler = commonMiddleware(placeBid).use(
    validator({
        inputSchema: placeBidSchema,
    })
);
