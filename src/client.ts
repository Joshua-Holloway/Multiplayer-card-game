import type {
    ClientMessage,
    ServerMessage
} from "./protocol";

console.log("Client loaded");

const statusElement =
    document.querySelector<HTMLParagraphElement>("#status");

const form = 
    document.querySelector<HTMLFormElement>("#message-form");

const input = 
    document.querySelector<HTMLInputElement>("#message-input");

const messages = 
    document.querySelector<HTMLUListElement>("#messages");

const takeCoinButton =
    document.querySelector<HTMLButtonElement>("#take_coin_button");

if (!statusElement || !form || !input || !messages || !takeCoinButton){
    throw new Error("Required HTML elements could not be found");
}

const socket = new WebSocket("ws://localhost:3000");

socket.addEventListener("open", () => {
    statusElement.innerText = "WebSocket connected";
});

socket.addEventListener("message", (event) => {
    const item = document.createElement("li");

    item.textContent = event.data;
    console.log("Received: " + event.data);
    messages.appendChild(item);
});

socket.addEventListener("close", () => {
    console.log("WebSocket disconnected");
});

socket.addEventListener("error", (event) => {
    console.log("Error: ", event);
});

form.addEventListener("submit", (event) => {
    event.preventDefault();
    
    const name = input.value.trim();

    if (name.length === 0){
        return;
    }

    sendMessage({
        type: "join",
        name: name
    });

    input.value = "";
});

takeCoinButton.addEventListener("click", () => {
    sendMessage({
        type: "take_coin"
    });
});

function sendMessage(message: ClientMessage): void {
    socket.send(JSON.stringify(message));
}