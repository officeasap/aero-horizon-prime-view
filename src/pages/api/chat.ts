import { NextApiRequest, NextApiResponse } from 'next';
import { fetchChatResponse } from '../../src/lib/fetchChatResponse'; // Import the fetchChatResponse function

// API route handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if the request method is POST
  if (req.method === 'POST') {
    try {
      // Get the message from the request body
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Call fetchChatResponse to get the AI response
      const chatResponse = await fetchChatResponse(message);

      // Return the chat response as JSON
      return res.status(200).json({ response: chatResponse });
    } catch (error) {
      // Handle any errors during the fetch operation
      console.error(error);
      return res.status(500).json({ error: 'Failed to get chat response' });
    }
  } else {
    // If the request is not a POST, return a 405 Method Not Allowed response
    res.status(405).json({ error: 'Method not allowed' });
  }
}
