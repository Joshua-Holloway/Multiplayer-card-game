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
                    
                    // add player to players if player doesnt already exist
                    players.push({
                        id: id,
                        name: message.name,
                        coins: 0
                    });

                    sendMessage(socket, {
                        type: "welcome",
                        playerId: id
                    });

                    broadcastGameState();
                }
                break;
            
            case "take_coin":
                console.log("Take coin requested");
                let coin_id = playerIdBySocket.get(socket);
                if(coin_id === undefined){
                    sendMessage(socket, {
                        type: "error",
                        message: "You have not joined"
                    });
                }

                else if(players.length > 0){
                    let current_player = players[currentPlayerIndex];
                    if(current_player.id != coin_id){
                        sendMessage(socket, {
                            type: "error",
                            message: "It is not your turn"
                        });
                    } else {
                        current_player.coins += 1;
                        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
                        broadcastGameState();
                    }
                }
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

function getGameState(): GameState{
    if (players.length === 0){
        var currentGameState: GameState = {
            players: players,
            currentPlayerId: null
        };
    } else{
        var currentGameState: GameState = {
            players: players,
            currentPlayerId: players[currentPlayerIndex].id
        };
    }

    return currentGameState;
}

function broadcastGameState(): void{
    broadcast({
        type: "state",
        state: getGameState()
    });
}