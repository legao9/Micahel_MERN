import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
// import { VerifyToken, VerifySocketToken } from "./middlewares/VerifyToken.js";
import {router as authRoutes} from "./routes/auth.js";
import {router as chatRoutes} from "./routes/chatRoutes.js";
import {router as agentRoutes} from "./routes/AgentInfo.js" 

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const PORT = process.env.PORT || 5000;

app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);
app.use('/agent', agentRoutes);

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