import { GoogleGenAI, Chat } from "@google/genai";
import { Product } from '../types';

const API_KEY = process.env.API_KEY || '';

let chatSession: Chat | null = null;

export const initializeChat = (products: Product[]) => {
  if (!API_KEY) {
    console.error("API Key is missing.");
    return;
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  // Create a context string of available products
  const productContext = products.map(p => 
    `- ${p.name} ($${p.price}): ${p.description} (Ingredients: ${p.ingredients.join(', ')}) [Stock: ${p.stock}]`
  ).join('\n');

  const systemInstruction = `
    You are the "Serenity Sommelier", an expert herbal tea guide for a shop called Serenity Brews.
    
    Your goal is to help customers choose the perfect tea from our catalog.
    
    Here is our current product catalog:
    ${productContext}
    
    Rules:
    1. Only recommend teas from our catalog.
    2. If a user mentions a specific ailment (sleep, digestion, stress), recommend the most relevant tea and explain why based on its ingredients.
    3. Be polite, calming, and concise. Use soothing language.
    4. If a tea is low in stock (less than 5), mention that they should hurry!
    5. Do not hallucinate products we don't have.
    6. Keep responses short (under 100 words) unless asked for more detail.
  `;

  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.7,
    },
  });
};

export const sendMessageToSommelier = async (message: string): Promise<string> => {
  if (!chatSession) {
    return "I'm sorry, I haven't been initialized properly. Please refresh the page.";
  }

  try {
    const result = await chatSession.sendMessage({ message });
    return result.text || "I'm having trouble finding the right leaves to read. Please try again.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I seem to have spilled the tea... (API Error). Please check your connection.";
  }
};