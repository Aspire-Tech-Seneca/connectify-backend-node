const io = require('socket.io-client');
const readline = require('readline');

const socket = io('http://localhost:3000');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const senderId = 'ali';
const receiverId = 'reza';

// socket.emit('join', { userId: senderId, token: `${token}` });
socket.emit('join', { userId: senderId, token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQyMzE0MTg5LCJpYXQiOjE3NDIzMTM4ODksImp0aSI6ImVhMzEwZTIwNzk1ZTQzZjFhZjM1OGE4MTY5MGIzZGE3IiwidXNlcl9pZCI6NTF9.KajiaRZjVYUDocoWCquJ3Vk3E4_rr7yyRnzBCm-VNkg' });

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
