import AWS from 'aws-sdk';
import commonMiddleware from '../middlewares/common';
import createError from 'http-errors';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const getAuctionByid = async id => {
    let auction;
    try {
        const result = await dynamoDB
            .get({
                TableName: process.env.AUCTIONS_TABLE_NAME,
                Key: { id },
            })
            .promise();

        auction = result.Item;
    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError(error);
    }

    if (!auction) {
        throw new createError.NotFound(
            JSON.stringify({
                msg: `Auction with Id: ${id} not found.`,
            })
        );
    }
    return auction;
};

// Get Auctions handler
const getAuction = async (event, context) => {
    let auction;

    const { id } = event.pathParameters;
    auction = await getAuctionByid(id);

    return {
        statusCode: 200,
        body: JSON.stringify(auction),
    };
};

export const handler = commonMiddleware(getAuction);
