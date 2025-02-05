import { Server } from "socket.io";
import http from 'http';

import express from "express";

const app = express();

const server = http.createServer(app);

// used to store the online users


const io = new Server(server , {
    cors: {
        origin : ["http://localhost:5173"]
    }
})

const userSocketMap = {};

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

io.on("connection" , (socket) => {
    console.log("User has connected" , socket.id);

    const userId = socket.handshake.query.userId

    if (userId) {
        userSocketMap[userId] = socket.id
    }

    io.emit("getOnlineUsers" , Object.keys(userSocketMap));

    socket.on("disconnect" , () =>{
        console.log("User is disconnected" , socket.id);  
        delete userSocketMap[userId]
        io.emit("getOnlineUsers" , Object.keys(userSocketMap))
    })
})


export {io , app , server};