import WebSocket, { WebSocketServer } from "ws";

const PORT = 3000;

const server = new WebSocketServer({
    port: PORT
});

server.on("listening", () => {
    console.log("WebSocket server listening on port ${PORT}");
});

server.on("connection", (socket) => {
    console.log("A client has connected");

    socket.send("Hello from the server");

    socket.on("message", (data) => {
        const message = data.toString();

        console.log("Recieved: $(message)");

        server.clients.forEach((client) => {
            if (client.readyState == WebSocket.OPEN){
                console.log("Hello");
            } 
        });

    });

    socket.on("close", () => {
        console.log("A client disconnected");
    });
});