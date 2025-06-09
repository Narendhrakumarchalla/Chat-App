import express from 'express'
import "dotenv/config"
import http from "http"
import cors from 'cors'

import connectDB from './lib/db.js'
import userRoutes from './routes/userRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import { Server } from 'socket.io'


const app = express()
const server = http.createServer(app)

//initialize socket.io
export const io = new Server(server, {
    cors: {
        origin: "*"
    }
})

export const userSocketMap = {}

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
        console.log(`User ${userId} connected with socket ID: ${socket.id}`);
    }

    //emit the socket ID to the client
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        console.log(`User ${userId} disconnected`);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
})





app.use(express.json({ limit: '10mb' }))
app.use(cors())
app.use('/api/user', userRoutes)
app.use('/api/message', messageRoutes)


connectDB()

app.get('/' , (req,res)=>{
    res.send("Hello")
})

const port = process.env.PORT || 4000

server.listen(port , ()=>{
    console.log('Server connected successfully');
})