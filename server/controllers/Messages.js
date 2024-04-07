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

const getTestMessages = async (req, res) => {
    const id = req.body.id;
    console.log('request chat route:10:',id);
    const messages = await model.getTestMessages(id);
    console.log(messages);
    res.json({ messages });
}

module.exports = {Messages};
module.exports = {getTestMessages};

