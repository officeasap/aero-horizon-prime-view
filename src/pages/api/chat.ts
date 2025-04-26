
import { NextApiRequest, NextApiResponse } from 'next';
import { fetchChatResponse } from '@/services/chatService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, previousMessages } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await fetchChatResponse(message, previousMessages);
    return res.status(200).json({ response });
  } catch (error) {
    console.error('Chat API Error:', error);
    return res.status(500).json({ error: 'Failed to get chat response' });
  }
}
