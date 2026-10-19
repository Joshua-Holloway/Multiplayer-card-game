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
    throw new Error("Required HTML elements couldnt not be found");
}

const socket = new WebSocket("ws://localhost:3000");

socket.addEventListener("open", () => {
    statusElement.innerText = "WebSocket connected";
});

socket.addEventListener("message", (event) => {
    const item = document.createElement("li");

    item.textContent = event.data;

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
    
    const message = input.value.trim();

    if (message.length === 0){
        return;
    }

    socket.send(message);

    input.value = "";
});

