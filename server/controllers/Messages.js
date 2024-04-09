const model = require('../model/model.js');

const Messages = async (req, res) => {
    try {
        const agentId = req.query.token;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const messages = await model.getMessagesForUser(agentId, limit, offset);

        res.status(200).json({
            currentPage: page,
            messages: messages,
            // Optionally include totalMessages, hasNextPage, etc.
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// const getTestMessages = async (req, res) => {
//     const id = req.body.id;
//     console.log('Messges.js-10:',id);
//     const messages = await model.getTestMessages(id);
//     // console.log(messages);
//     res.json({ messages });
// }
const getTestMessages = async (req, res) => {
    const id = req.body.id;
    console.log('Messges.js, id:', id);

    try {
        const messages = await model.getTestMessages(id);
        if (messages) {
            console.log('model---:', messages.length); // This is the array of messages        
            res.json({ messages });
        } else {
            res.status(500).json({ error: "Failed to retrieve messages" });
        }
    } catch (error) {
        if (error.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Error: Connection lost. Reconnecting...');
            // You can handle reconnection logic here or try re-executing the query.
            // You may need to re-establish the connection to the MySQL server.
        } else {
            console.error('Error in getTestMessages:', error);
            res.status(500).json({ error: "An error occurred while retrieving messages" });
        }
    }
}

module.exports = {Messages};
module.exports = {getTestMessages};

