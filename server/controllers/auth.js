// import e from 'express';
import model from '../model/model.js';
import exp from 'constants';
// const bcrypt = await import('bcrypt');
const crypto = await import('crypto');


// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// import { readFileSync } from 'fs';
// import dotenv from 'dotenv';
// import('dotenv').config();
// const api_secret = process.env.STREAM_API_SECRET;
// const app_id = process.env.STREAM_APP_ID;

// export const signup = async (req, res) => {
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

// export const login = async (req, res) => {
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
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(username, password);
        const modelInstance = await model(); // Call model as a function to get the object
        const user = await modelInstance.getUserByUsername(username)
        if (user === null) {
            return res.json({ message: 'User not found' });
        }
        else {
            // const success = await modelInstance.validateCredentials(username, password);
            const uerRow = await modelInstance.getUserByUsername(username);
            // const token = (uerRow.keyID); //token = userID
            console.log(uerRow);
            // console.log(generateHmacToken(uerRow.keyId), 76);
            res.json({ message: 'Login successful', token: uerRow });
            // if (success) {
            //     // Simplified response for successful login
            //     res.json({ message: 'Login successful', token: token });
            // } else {
            //     res.json({ message: 'Incorrect password' });
            // }
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

//function to generate token
function generateHmacToken(agentId) {
    return crypto.createHash('sha256').update(String(agentId)).digest('hex')
}