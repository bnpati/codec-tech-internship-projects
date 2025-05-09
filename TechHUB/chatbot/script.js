const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const messages = document.getElementById('messages');

sendBtn.addEventListener('click', async () => {
    const userMessage = userInput.value;
    if (!userMessage.trim()) return;

    // Add user message to chat
    addMessage(userMessage, 'user');

    // Send the message to the Gemini API
    const botReply = await getBotReply(userMessage);
    addMessage(botReply, 'bot');

    userInput.value = '';
});

function addMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.textContent = message;
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
}

async function getBotReply(message) {
    try {
        const response = await fetch('https://api.gemini.ai/v1/free-endpoint', { // Replace with Gemini's API endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_API_KEY' // Replace with Gemini's authentication method
            },
            body: JSON.stringify({
                input: message // Adjust payload structure as per Gemini's API documentation
            })
        });

        const data = await response.json();
        return data.reply || "Sorry, I couldn't understand that.";
    } catch (error) {
        console.error('Error:', error);
        return "There was an error connecting to the server.";
    }
}
