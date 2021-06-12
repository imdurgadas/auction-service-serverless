import getEndedAuction from '../utils/getEndedAuction';
import closeAuction from '../utils/closeAuction';
import createError from 'http-errors';

const processAuctions = async (event, context) => {
    try {
        const endedAuctions = await getEndedAuction();
        const closePromises = endedAuctions.map(auction => {
            closeAuction(auction);
        });
        await Promise.all(closePromises);
        return { closed: closePromises.length };
    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError(
            JSON.stringify({
                msg: error,
            })
        );
    }
};

export const handler = processAuctions;
