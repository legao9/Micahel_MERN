const express = require('express');
const cors = require('cors');

const authRoutes = require("./routes/auth.js");
const chatRoutes = require('./routes/chatRoutes.js');
const agentRoutes = require('./routes/AgentInfo.js')

const app = express();
const PORT = process.env.PORT || 5000;

require("dotenv").config();



app.use(cors());
app.use(express.json());
app.use(express.urlencoded());


// const model = require('./model/model.js');

// async function testGetUserByKeyId() {
//     try {
//         const userData = await model.getUserByKeyId(2);
//         console.log('User Data:', userData);
//     } catch (error) {
//         console.error('Error fetching user data:', error);
//     }
// }
// async function getTestMessages(idxUserId) {
//     console.log(idxUserId);
//     try {
//         const userData = await model.getTestMessages(idxUserId);
//         console.log('data of RecvRcd_20240402:', userData);
//     } catch (error) {
//         console.error('Error fetching message history:', error);
//     }
// }

// testGetUserByKeyId();
// getTestMessages(15)

// app.use("/getMessage/id", (req, res) => {
//     console.log(req.params);
//     const id = req.params.id;
//     const messages = model.getTestMessages(id);
//     res.json({ messages });
// });

app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);
app.use('/agent', agentRoutes);




app.listen(PORT, () => console.log(`Server running on port ${PORT}`));