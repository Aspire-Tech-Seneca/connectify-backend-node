const express = require("express");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3001;

// Serve the built React frontend
app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("New user connected");

  socket.on("joinRoom", ({ username, room }) => {
    socket.join(room);
    socket.to(room).emit("message", `${username} has joined the room`);
  });

  socket.on("chatMessage", (data) => {
    io.to(data.room).emit("message", `${data.username}: ${data.message}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(PORT, () => console.log(`SERVER RUNNING on port ${PORT}`));
