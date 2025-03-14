const express = require('express');
const axios = require('axios');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.json());

const BASE_URL = 'http://74.235.209.82:8000/users';
let userSockets = {}; // Map users to socket IDs

// Retrieve matched users with token
async function getMatchedUsers(token) {
    try {
        const response = await axios.get(`${BASE_URL}/get-mymatchup-list/`, {
            // headers: { Authorization: `Bearer ${token}` }
            headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQxOTc1NDQ0LCJpYXQiOjE3NDE5NzUxNDQsImp0aSI6IjQyYmRmNWNhZmM1ZTQ0OTc4OTZmZWJiODhhMTUxNjM1IiwidXNlcl9pZCI6MjV9.My1QeQ-2YHDX0z9k7pgiHLySlHXADyBeOsbYtbzv_Nk` }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch matched users:', error);
        return [];
    }
}

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // User joins with their ID
    socket.on('join', async ({ userId, token }) => {
        userSockets[userId] = socket.id;
        const matchedUsers = await getMatchedUsers(token);
        socket.emit('matchedUsers', matchedUsers);
        console.log(`User ${userId} joined and retrieved matched users.`);
    });

    // Start chat with a selected user
    socket.on('startChat', ({ senderId, receiverId }) => {
        if (userSockets[receiverId]) {
            socket.emit('chatStarted', { senderId, receiverId, status: 'ready' });
            console.log(`Chat started between ${senderId} and ${receiverId}`);
        } else {
            socket.emit('chatStarted', { status: 'offline', message: 'User is not online' });
        }
    });

    // Handle direct messages between users
    socket.on('message', ({ senderId, receiverId, message }) => {
        if (userSockets[receiverId]) {
            io.to(userSockets[receiverId]).emit('message', { senderId, message });
            console.log(`Message from ${senderId} to ${receiverId}: ${message}`);
        } else {
            console.log(`User ${receiverId} is not online`);
        }
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        for (let userId in userSockets) {
            if (userSockets[userId] === socket.id) {
                delete userSockets[userId];
                break;
            }
        }
    });
});

// Start server
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
