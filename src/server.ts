import WebSocket, { WebSocketServer } from "ws";

import {randomUUID} from "node:crypto";

import type{
    ClientMessage,
    GameState,
    Player,
    ServerMessage
} from "./protocol";

const PORT = 3000;

const server = new WebSocketServer({
    port: PORT
});

const players: Player[] = [];

const playerIdBySocket = new Map<WebSocket, string>();

let currentPlayerIndex = 0;

server.on('listening', () => {
    console.log('WebSocket server listening on port '+ PORT);
});

server.on('connection', (socket) => {
    console.log('A client has connected');

    socket.on('message', (data) => {
        const text = data.toString();

        console.log('Received: ' + text);

        const message = JSON.parse(text) as ClientMessage

        switch (message.type){
            case "join":
                if (playerIdBySocket.has(socket)){
                    sendMessage(socket, {
                        type: "error",
                        message: "You have already joined"
                    });
                } else{
                    const id = randomUUID();
                    playerIdBySocket.set(socket, id);
                    sendMessage(socket, {
                        type: "welcome",
                        playerId: id
                    });
                }
                break;
            
            case "take_coin":
                console.log("Take coin requested");
                break;

        }

    });

    socket.on('close', () => {
        console.log('A client disconnected');
    });
});

function sendMessage(
    socket: WebSocket,
    message: ServerMessage
): void {
    socket.send(JSON.stringify(message));
}

function broadcast(message: ServerMessage): void {
    server.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN){
            sendMessage(client, message);
        }
    });
}