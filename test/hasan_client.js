const io = require('socket.io-client');
const readline = require('readline');

const socket = io('http://localhost:3000');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const senderId = 'hasan';
const receiverId = 'behzad';

// socket.emit('join', { userId: senderId, token: `${token}` });
socket.emit('join', { userId: senderId, token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQxOTc4MjI0LCJpYXQiOjE3NDE5Nzc5MjQsImp0aSI6ImZjZjRlNDI3ZmU4NTRlY2RhM2Q2YjJmZGQzNzcxNWI1IiwidXNlcl9pZCI6Mjd9.xUl1wF-5tClJ6DlEpy2x50fzrrlDZ16FLYLK6Odom-Y' });

socket.on('matchedUsers', (users) => {
    console.log('Matched users:', users);
    socket.emit('startChat', { senderId, receiverId });
});

socket.on('chatStarted', (data) => {
    console.log(`Chat started with ${receiverId}`);

    // ✅ Request chat history
    socket.emit('getChatHistory', { senderId, receiverId });
});

// ✅ Receive chat history and display it
socket.on('chatHistory', (messages) => {
    console.log('📜 Chat History:');
    messages.forEach(msg => {
        console.log(`${msg.senderId}: ${msg.message} (${new Date(msg.timestamp).toLocaleString()})`);
    });

    askMessage(); // Ask for new messages after showing history
});

socket.on('message', (data) => {
    console.log(`${data.senderId}: ${data.message}`);
    askMessage(); // Ask for new messages after receiving one
});

function askMessage() {
    rl.question('Type your message: ', (msg) => {
        socket.emit('message', { senderId, receiverId, message: msg });
    });
}
