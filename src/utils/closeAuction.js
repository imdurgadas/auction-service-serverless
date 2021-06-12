import AWS from 'aws-sdk';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const closeAuction = async auction => {
    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id: auction.id },
        UpdateExpression: 'set #status = :status',
        ExpressionAttributeNames: {
            '#status': 'status',
        },
        ExpressionAttributeValues: {
            ':status': 'CLOSED',
        },
    };
    const result = await dynamoDB.update(params).promise();

    return result.Items;
};

export default closeAuction;
