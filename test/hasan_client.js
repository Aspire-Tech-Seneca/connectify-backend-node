const io = require('socket.io-client');
const readline = require('readline');

const socket = io('http://localhost:3000');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

socket.emit('join', { userId: 'hasan', token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQxOTc4MjI0LCJpYXQiOjE3NDE5Nzc5MjQsImp0aSI6ImZjZjRlNDI3ZmU4NTRlY2RhM2Q2YjJmZGQzNzcxNWI1IiwidXNlcl9pZCI6Mjd9.xUl1wF-5tClJ6DlEpy2x50fzrrlDZ16FLYLK6Odom-Y' });

socket.on('message', (data) => {
    console.log(`${data.senderId}: ${data.message}`);
    askMessage(); // Ask for a new message after receiving one
});

function askMessage() {
    rl.question('Type your message: ', (msg) => {
        socket.emit('message', { senderId: 'hasan', receiverId: 'behzad', message: msg });
    });
}
