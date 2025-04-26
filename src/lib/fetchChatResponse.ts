// src/lib/fetchChatResponse.ts

// Ensure you have a proper import for dotenv if using this in a Node.js server-side environment
import dotenv from 'dotenv';
dotenv.config(); // This will load the variables from your .env file

export async function fetchChatResponse(message: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY; // Get the API key from the environment variable
  
  if (!apiKey) {
    throw new Error('API Key is missing in the environment variables');
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`, // Use the API key from the .env file
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://asaptracker.com/', // Your website domain
        'X-Title': 'ASAP Agent', // Your bot name
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo', // Model you want to use
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Chat API Error:', errorText);
      throw new Error(`Failed to fetch chat response: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error('Unexpected Chat API Response:', data);
      throw new Error('Invalid response structure from chat API');
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('fetchChatResponse error:', error);
    throw error;
  }
}
