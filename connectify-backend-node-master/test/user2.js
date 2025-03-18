const io = require('socket.io-client');
const readline = require('readline');

const socket = io('http://localhost:3000');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const senderId = 'reza';
const receiverId = 'ali';

// socket.emit('join', { userId: senderId, token: `${token}` });
socket.emit('join', { userId: senderId, token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQyMzE0MjUyLCJpYXQiOjE3NDIzMTM5NTIsImp0aSI6ImM3OTczODE2YzlmZTRkYjlhMzMzYjE4Yjc3MGM5YTg4IiwidXNlcl9pZCI6NTJ9.7_FHis_uHfTquXTWgDxC7GRSU6-pUMiMxTajjHOk0VE' });

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
