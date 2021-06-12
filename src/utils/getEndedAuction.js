import AWS from 'aws-sdk';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const getEndedAuctions = async () => {
    const now = new Date();
    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        IndexName: 'statusAndEndDate',
        KeyConditionExpression: '#status = :status and endingAt <= :now',
        ExpressionAttributeNames: {
            '#status': 'status',
        },
        ExpressionAttributeValues: {
            ':status': 'OPEN',
            ':now': now.toISOString(),
        },
    };
    const result = await dynamoDB.query(params).promise();
    return result.Items;
};

export default getEndedAuctions;
