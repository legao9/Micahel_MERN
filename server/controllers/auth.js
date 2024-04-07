
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const model = require('../model/model');



require('dotenv').config();


// const api_secret = process.env.STREAM_API_SECRET;
// const app_id = process.env.STREAM_APP_ID;

// const signup = async (req, res) => {
//     try {
//         const { fullName, username, password, phoneNumber } = req.body;

//         const userId = crypto.randomBytes(16).toString('hex');

//         const serverClient = connect(api_key, api_secret, app_id);

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const token = serverClient.createUserToken(userId);

//         res.status(200).json({ token, fullName, username, userId, hashedPassword, phoneNumber });
//     } catch (error) {
//         console.log(error);

//         res.status(500).json({ message: error });
//     }
// };

// const login = async (req, res) => {
//     try {
//         const { username, password } = req.body;
        
//         const serverClient = connect(api_key, api_secret, app_id);
//         const client = StreamChat.getInstance(api_key, api_secret);

//         const { users } = await client.queryUsers({ name: username });

//         if(!users.length) return res.status(400).json({ message: 'User not found' });

//         const success = await bcrypt.compare(password, users[0].hashedPassword);

//         const token = serverClient.createUserToken(users[0].id);

//         if(success) {
//             res.status(200).json({ token, fullName: users[0].fullName, username, userId: users[0].id});
//         } else {
//             res.status(500).json({ message: 'Incorrect password' });
//         }
//     } catch (error) {ads
//         console.log(error);

//         res.status(500).json({ message: error });
//     }
// };




//New code to work with my DB, can integrate with StreamChat etc
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        console.log(username, password);
        // Use database query to get user
        const user = await model.getUserByUsername(username);

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Validate credentials
        const success = await model.validateCredentials(username, password);
        
        const agent_id = model.getAgentId(username);
        const token = (agent_id);

        if (success) {
            // Simplified response for successful login
            res.status(200).json({ message: 'Login successful', token: token });
        } else {
            res.status(401).json({ message: 'Incorrect password' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
};

//function to generate token
function generateHmacToken(agentId) {
  return crypto.createHash('sha256').update(String(agentId)).digest('hex')
}

module.exports = {login }