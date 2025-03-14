const io = require('socket.io-client');
const readline = require('readline');

const socket = io('http://localhost:3000');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

socket.emit('join', { userId: 'hasan', token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQxOTc1NzAxLCJpYXQiOjE3NDE5NzU0MDEsImp0aSI6ImRlMDExOTk1YTAxMTRmNGZhMGI2MTgzNGE4MzA4ZTg0IiwidXNlcl9pZCI6Mjd9.aKWMH0JEbQp7Ey1uaBeS6MmYUPu6Khl7xXNaa9fHcR0' });

socket.on('message', (data) => {
    console.log(`${data.senderId}: ${data.message}`);
    askMessage(); // Ask for a new message after receiving one
});

function askMessage() {
    rl.question('Type your message: ', (msg) => {
        socket.emit('message', { senderId: 'hasan', receiverId: 'behzad', message: msg });
    });
}
