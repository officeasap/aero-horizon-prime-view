// Initialize the chatbot
function initChatbot() {
    const chatButton = document.querySelector(".lucide-message-square"); // The chat button element
    const chatWindow = document.createElement("div"); // The chat window

    // Set some basic styles for the chat window
    chatWindow.style.position = "fixed";
    chatWindow.style.bottom = "20px";
    chatWindow.style.right = "20px";
    chatWindow.style.width = "350px";
    chatWindow.style.height = "500px";
    chatWindow.style.backgroundColor = "#fff";
    chatWindow.style.borderRadius = "10px";
    chatWindow.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)";
    chatWindow.style.display = "none";
    chatWindow.style.zIndex = "1000";

    // Create a chat window content (e.g., a header and a message area)
    chatWindow.innerHTML = `
        <div style="background-color: #8B0000; color: white; padding: 10px; text-align: center;">
            <h3>ASAP Agent</h3>
        </div>
        <div id="chatContent" style="padding: 10px; overflow-y: auto; height: 400px;">
            <!-- Messages will be appended here -->
        </div>
        <div style="padding: 10px; background-color: #f0f0f0;">
            <input id="chatInput" type="text" placeholder="Ask a question..." style="width: 80%; padding: 5px; border-radius: 5px;">
            <button id="sendBtn" style="width: 15%; padding: 5px; background-color: #8B0000; color: white; border: none; border-radius: 5px;">Send</button>
        </div>
    `;
    
    // Append the chat window to the body
    document.body.appendChild(chatWindow);

    // Toggle the chat window visibility when the button is clicked
    chatButton.addEventListener("click", function() {
        chatWindow.style.display = chatWindow.style.display === "none" ? "block" : "none";
    });

    // Send a message when the send button is clicked
    document.getElementById("sendBtn").addEventListener("click", function() {
        const userMessage = document.getElementById("chatInput").value;
        if (userMessage.trim()) {
            appendMessage("You", userMessage);
            getBotResponse(userMessage); // Get bot response from OpenRouter API
        }
    });
}

// Append a message to the chat window
function appendMessage(sender, message) {
    const chatContent = document.getElementById("chatContent");
    const messageDiv = document.createElement("div");
    messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatContent.appendChild(messageDiv);
    chatContent.scrollTop = chatContent.scrollHeight; // Scroll to the bottom
}

// Get a response from the OpenRouter AI API
function getBotResponse(userMessage) {
     const apiUrl = 'https://api.openrouter.ai/v1/query'; // Replace with OpenRouter API URL
 const apiKey = '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'; // Your OpenRouter API key

    const data = {
        prompt: userMessage,
        max_tokens: 150,
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        const botMessage = data.choices[0].text.trim();
        appendMessage("ASAP Agent", botMessage); // Display the bot's response
    })
    .catch(error => {
        console.error("Error fetching from OpenRouter API:", error);
        appendMessage("ASAP Agent", "Sorry, I couldn't get a response at the moment.");
    });
}

// Fetch flight information from AviationStack API (optional, depending on query)
function getFlightInfo(query) {
    const apiUrl = 'https://api.aviationstack.com/v1/flights'; // Replace with AviationStack API URL
    const apiKey = 'c1e20070cd11b45c048c0f3ac887377e'; // Your AviationStack API key

    fetch(`${apiUrl}?access_key=${apiKey}&query=${query}`)
    .then(response => response.json())
    .then(data => {
        const flightInfo = data.data[0]; // Get first flight result
        const flightMessage = `Flight ${flightInfo.flight.iata} is currently ${flightInfo.flight_status}.`;
        appendMessage("ASAP Agent", flightMessage);
    })
    .catch(error => {
        console.error("Error fetching from AviationStack API:", error);
        appendMessage("ASAP Agent", "Sorry, I couldn't fetch flight information at the moment.");
    });
}

// Initialize chatbot after the page has loaded
document.addEventListener("DOMContentLoaded", function() {
    initChatbot(); // Initialize chatbot logic
});
