# WebChat Application

## Overview
This is a real-time chat application using **Node.js, Express, Socket.IO, and MongoDB**. The app allows users to connect, view matched users, retrieve chat history, and send real-time messages.

## Features
- User authentication via token.
- View matched users.
- Real-time messaging using Socket.IO.
- Chat history retrieval from MongoDB.
- Supports multiple clients (e.g., `behzad_client.js` and `hasan_client.js`).

## Project Structure
```
webchat/
│-- node_modules/
│-- test/
│   │-- behzad_client.js
│   │-- hasan_client.js
│-- .gitignore
│-- package-lock.json
│-- package.json
│-- README.md
│-- server.js
```

## Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [Docker](https://www.docker.com/)
- [MongoDB](https://www.mongodb.com/) (or use a **MongoDB Docker container**)

## Setup Instructions

### 1. Install Dependencies
Run the following command:
```sh
npm install
```

### 2. Start MongoDB Container
```sh
docker run -d --name mongodb_container --network chat_network -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=adminpass \
  mongo:latest
```

### 3. Start the Chat Server
```sh
docker run -d --name chat_server --network chat_network -p 3000:3000 \
  -v $(pwd):/app -w /app node npm start
```

### 4. Run the Clients
Open separate terminals and run:
```sh
node test/behzad_client.js
```
```sh
node test/hasan_client.js
```

## Usage

### Connecting to the Server
Each client must emit a join event with their user ID and token:
```javascript
socket.emit('join', { userId: 'behzad', token: 'your_jwt_token_here' });
```

### Retrieving Chat History
After joining, the client requests previous messages:
```javascript
socket.emit('getChatHistory', { senderId: 'behzad', receiverId: 'hasan' });
```
The server responds with:
```javascript
socket.on('chatHistory', (history) => {
    console.log('Chat History:', history);
});
```

### Sending a Message
```javascript
socket.emit('message', { senderId: 'behzad', receiverId: 'hasan', message: 'Hello Hasan!' });
```

### Handling Incoming Messages
```javascript
socket.on('message', (data) => {
    console.log(`${data.senderId}: ${data.message}`);
});
```

## API Endpoints
| Method | Endpoint            | Description                  |
|--------|--------------------|------------------------------|
| GET    | `/get-mymatchup-list/` | Retrieves matched users      |
| POST   | `/message`          | Stores a message in MongoDB |

## WebSockets Events
| Event Name     | Description                  |
|---------------|------------------------------|
| `join`        | User joins the chat          |
| `matchedUsers`| Retrieves matched users      |
| `startChat`   | Starts a conversation        |
| `message`     | Sends a chat message         |
| `chatHistory` | Retrieves chat history       |

## Future Improvements
- Implement user authentication.
- Add a frontend UI for better usability.
- Support group chats.
