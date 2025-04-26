
import { toast } from "sonner";

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export async function fetchChatResponse(message: string, previousMessages: any[] = []) {
  if (!message.trim()) {
    return "";
  }

  try {
    const response = await fetch('https://api.openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'ASAP Agent'
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku",
        messages: [
          {
            role: "system",
            content: `You are ASAP Agent, a friendly and knowledgeable AI assistant for the aviation tracking website. 
            You specialize in flight information, schedules, and travel-related queries. Be helpful, clear, and concise.
            When discussing aviation topics, use accurate terminology but remain conversational.`
          },
          ...previousMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching chat response:', error);
    toast.error('Unable to get a response. Please try again.');
    return "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.";
  }
}
