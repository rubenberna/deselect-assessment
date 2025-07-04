import {generateText} from 'ai';
import {openai} from '@ai-sdk/openai';

const count = 10; // Number of messages to generate
export const generateFunnyLoadingMessages = async (): Promise<string[]> => {
  const systemPrompt = `
    You are a creative assistant that generates short, funny, quirky, and lighthearted loading messages.
    The messages should be concise, ideally one sentence each.
    They should be suitable for a user waiting for content to load.
    Avoid anything too complex, offensive, or controversial.
    Do NOT include any introductory or concluding remarks. Just the list of messages.
    Format your response as a JSON array of strings.
    Example: ["Stretching the bits and bytes.","Polishing the pixels.","Summoning the data demons.","Herding cats (and data)."]
  `;

  const userPrompt = `Generate ${count} different funny loading messages.`;

  try {
    const {text} = await generateText({
      model: openai('gpt-3.5-turbo'),
      system: systemPrompt,
      messages: [{role: 'user', content: userPrompt}],
      temperature: 0.8, // A bit higher temperature for creativity
      maxTokens: 300, // Sufficient for a few short messages
    });

    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
        return parsed;
      }
      console.warn("AI response was not a valid JSON array of strings:", text);
      return getDefaultMessages(); // Fallback
    } catch (parseError) {
      console.error("Failed to parse AI-generated JSON:", parseError);
      return getDefaultMessages(); // Fallback
    }

  } catch (error) {
    console.error("Error generating funny loading messages:", error);
    return getDefaultMessages();
  }
};

const getDefaultMessages = (): string[] => [
  "Loading... please wait a byte.",
  "Unleashing the data Kraken.",
  "Gathering pixels from the ether.",
  "Just a moment, almost there!",
  "Brewing fresh data, hold tight.",
  "Counting to infinity, almost done.",
  "Warming up the hamsters.",
  "Debugging the Matrix...",
  "Spinning up the servers (literally).",
];