import model from '../model/model.js';

export const Messages = async (req, res) => {
    try {
        const agentId = req.query.token;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const messages = await model.getMessagesForUser(agentId, limit, offset);

        res.status(200).json({
            currentPage: page,
            messages: messages,
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


// export const getTestMessages = async (req, res) => {
//     const id = req.body.id;
//     console.log('new request id:', id);    
//     try {
//         const modelInstance = await model(); // Call model as a function to get the object
//         const messages = await modelInstance.getTestMessages(id); // Use the object to access getTestMessages
//         if (messages) {
//             res.json({ messages });
//         } else {
//             res.status(500).json({ error: "Failed to retrieve messages" });
//         }
//     } catch (error) {
//         if (error.code === 'PROTOCOL_CONNECTION_LOST') {
//             console.error('Error: Connection lost. Reconnecting...');
//         } else {
//             console.error('Error in getTestMessages:', error);
//             res.status(500).json({ error: "An error occurred while retrieving messages" });
//         }
//     }
// }
export const getUsersAndLastMessages = async (req, res) => {
    const id = req.body.id;
    console.log('new request id:', id);    
    try {
        const modelInstance = await model(); // Call model as a function to get the object
        const messages = await modelInstance.getUsersAndLastMessages(id); // Use the object to access getTestMessages
        if (messages) {
            res.json({ messages });
        } else {
            res.status(500).json({ error: "Failed to retrieve messages" });
        }
    } catch (error) {
        if (error.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Error: Connection lost. Reconnecting...');
        } else {
            console.error('Error in getUsersAndLastMessages:', error);
            res.status(500).json({ error: "An error occurred while retrieving getUsersAndLastMessages" });
        }
    }
}

// export const getSelectedUserMessages = async (req, res) => {
//     const id = req.body.id;
//     const sender = req.body.sender;
//     console.log('/getSelectedUserMessages (id/sender):', id,sender);    
//     try {
//         const modelInstance = await model(); // Call model as a function to get the object
//         const messages = await modelInstance.getSelectedUserMessages(id,sender); // Use the object to access getTestMessages
//         if(messages == null) return ;
//         if (messages.length > 0) {
//             res.json({ messages });
//         } else {
//             res.status(500).json({ error: "Failed to retrieve messages" });
//         }
//     } catch (error) {
//         if (error.code === 'PROTOCOL_CONNECTION_LOST') {
//             console.error('Error: Connection lost. Reconnecting...');
//         } else {
//             console.error('Error in getUsersAndLastMessages:', error);
//             res.status(500).json({ error: "An error occurred while retrieving getUsersAndLastMessages" });
//         }
//     }
// }
export const saveMsg = async (req, res) => {
    const reqBody = req.body;
    // const sender = req.body.sender;
    // const receiver = req.body.receiver;
    // const direction = req.body.direction;
    const id = req.body.id;
console.log(id, 909090909090900000000000000000000);
    try {
        const modelInstance = await model(); // Call model as a function to get the object
        const result = await modelInstance.saveMsg(reqBody); // Use the object to access addMessage
        res.json({ result });
    } catch (error) {
        console.error('Error in saveMessage:', error);
        res.status(500).json({ error: "An error occurred while saving the message" });
    }
}

export const UpdateMsgs = async (req, res) => {
    const reqBody = req.body;
    try {
        const modelInstance = await model(); // Call model as a function to get the object
        const result = await modelInstance.UpdateMsgs(reqBody); // Use the object to access addMessage
        res.json({ result });
    } catch (error) {
        console.error('Error in saveMessage:', error);
        res.status(500).json({ error: "An error occurred while updating the messages" });
    }
}

