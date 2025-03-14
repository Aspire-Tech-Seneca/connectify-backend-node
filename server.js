const express = require('express');
const axios = require('axios');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(bodyParser.json());

// ✅ Connect to MongoDB (Using the Container Name)
mongoose.connect('mongodb://admin:adminpass@mongodb_container:27017/chatDB?authSource=admin', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.log('❌ MongoDB connection error:', err));

// ✅ Define Message Schema
const messageSchema = new mongoose.Schema({
    senderId: String,
    receiverId: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

const BASE_URL = 'http://74.235.209.82:8000/users';
let userSockets = {}; // Map users to socket IDs

// ✅ Retrieve matched users with token
async function getMatchedUsers(token) {
    try {
        const response = await axios.get(`${BASE_URL}/get-mymatchup-list/`, {
            // headers: { Authorization: `Bearer ${token}` }
            headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQxOTc4MTk0LCJpYXQiOjE3NDE5Nzc4OTQsImp0aSI6IjYxYTVlMzhmOGY3ODRiYzE4MmExNTI0NzU5YjIyNDhjIiwidXNlcl9pZCI6MjV9.TxTz937y7XNW9s55DT8sbVmxAOIlHu9QA1Og7X4yk_k` }
        });
        return response.data;
    } catch (error) {
        console.error('❌ Failed to fetch matched users:', error);
        return [];
    }
}

// ✅ Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('🔗 A user connected:', socket.id);

    // ✅ User joins and gets chat history
    socket.on('join', async ({ userId, token }) => {
        userSockets[userId] = socket.id;
        const matchedUsers = await getMatchedUsers(token);
        socket.emit('matchedUsers', matchedUsers);

        // ✅ Retrieve chat history
        socket.on('getChatHistory', async ({ senderId, receiverId }) => {
            const chatHistory = await Message.find({
                $or: [
                    { senderId: senderId, receiverId: receiverId },
                    { senderId: receiverId, receiverId: senderId }
                ]
            }).sort({ timestamp: 1 });

            socket.emit('chatHistory', chatHistory);
        });

        console.log(`👤 User ${userId} joined and retrieved matched users.`);
    });

    // ✅ Start chat with a selected user
    socket.on('startChat', ({ senderId, receiverId }) => {
        if (userSockets[receiverId]) {
            socket.emit('chatStarted', { senderId, receiverId, status: 'ready' });
            console.log(`💬 Chat started between ${senderId} and ${receiverId}`);
        } else {
            socket.emit('chatStarted', { status: 'offline', message: 'User is not online' });
        }
    });

    // ✅ Handle messages and save to MongoDB
    socket.on('message', async ({ senderId, receiverId, message }) => {
        if (userSockets[receiverId]) {
            io.to(userSockets[receiverId]).emit('message', { senderId, message });

            // ✅ Save message in MongoDB
            const newMessage = new Message({ senderId, receiverId, message });
            await newMessage.save();

            console.log(`💾 Message saved: ${senderId} -> ${receiverId}: ${message}`);
        } else {
            console.log(`🚫 User ${receiverId} is not online`);
        }
    });

    // ✅ Handle user disconnection
    socket.on('disconnect', () => {
        console.log('❌ User disconnected:', socket.id);
        for (let userId in userSockets) {
            if (userSockets[userId] === socket.id) {
                delete userSockets[userId];
                break;
            }
        }
    });
});

// ✅ Start server
server.listen(3000, () => {
    console.log('🚀 Server is running on port 3000');
});
