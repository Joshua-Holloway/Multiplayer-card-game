import type {ClientMessage} from "./protocol";

console.log("Client loaded");

const statusElement =
    document.querySelector<HTMLParagraphElement>("#status");

const form = 
    document.querySelector<HTMLFormElement>("#message-form");

const input = 
    document.querySelector<HTMLInputElement>("#message-input");

const messages = 
    document.querySelector<HTMLUListElement>("#messages");

if (!statusElement || !form || !input || !messages){
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

    const message: ClientMessage = {
        type: "join",
        name: name
    };

    socket.send(JSON.stringify(message))
    
    input.value = "";
});

