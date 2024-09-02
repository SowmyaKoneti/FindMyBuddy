const io = require("socket.io")(3001, {
    cors: {
        origin: "http://localhost:3000", 
        methods: ["GET", "POST"],
    }
});

io.on("connection", (socket) => {
    console.log("A user connected.");

    socket.on("message", (message, roomName) => {
        if (roomName && typeof roomName === "string" && roomName.trim()) {
            // Send message only to clients in the specified room
            io.to(roomName).emit("message", message);
        } else {
            // Send message to all clients
            io.emit("message", message);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected.");
    });

    socket.on("joinRoom", (roomName) => {
        if (roomName && typeof roomName === "string" && roomName.trim()) {
            console.log("Joining room: " + roomName);
            socket.join(roomName);
        }
    });
});

console.log("Socket.IO server running on port 3001");
