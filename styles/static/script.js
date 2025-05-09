document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chatBox');
    const typingIndicator = document.getElementById('typingIndicator');
    const chatForm = document.getElementById('chatForm');
    const userInput = document.getElementById('userInput');

    // Show initial warm welcome message
    appendMessage("Hi there! 😊 I'm Zenbot, your AI friend. How are you feeling today?", "bot");

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userMessage = userInput.value.trim();
        if (userMessage === '') return;

        appendMessage(userMessage, 'user');
        userInput.value = '';

        await fetchBotResponse(userMessage);
    });

    function appendMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', `${sender}-message`);
        messageElement.textContent = message;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function fetchBotResponse(userMessage) {
        typingIndicator.style.visibility = 'visible';

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage })
            });

            typingIndicator.style.visibility = 'hidden';

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();
            appendMessage(data.bot_response, 'bot');
        } catch (error) {
            typingIndicator.style.visibility = 'hidden';
            appendMessage('I am here for you. Please try again later.', 'bot');
        }
    }
});
