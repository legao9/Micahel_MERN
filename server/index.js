import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
// import { VerifyToken, VerifySocketToken } from "./middlewares/VerifyToken.js";
import {router as authRoutes} from "./routes/auth.js";
import {router as chatRoutes} from "./routes/chatRoutes.js";
import {router as agentRoutes} from "./routes/AgentInfo.js" ;
import { router as sendMsgRouter } from './routes/sendMsg.js';
import { conversationRoutes } from './routes/conversationRoutes.js';

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const PORT = process.env.PORT || 5000;

// Middleware to log request details
app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/sendmsg', sendMsgRouter);
app.use('/api/conversation', conversationRoutes);


const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     // credentials: true,
//   },
// });

// var socketUsers = [];
// io.on("connection", (socket) => {

//   socket.on("disconnect", (socket) => {
//     console.log("A user disconnected");
//     socketUsers = socketUsers.filter(user => user.socketId == socket.id);
//     console.log('All users count: ', socketUsers.length);
//   });

//   socket.on("newConnect", (data) => {
//     socketUsers.push({socketId:socket.id, idxUserId : data.idxUserId});
//     console.log("New client: ", data);
//     console.log('All users count: ', socketUsers.length);
//   });

// });