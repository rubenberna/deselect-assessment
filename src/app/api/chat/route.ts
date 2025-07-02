import {openai} from '@ai-sdk/openai';
import {streamText} from 'ai';
import {queryPDF} from "@/src/lib/db/chroma";

export const maxDuration = 30;

const systemPrompt = `
You are a precise and helpful AI assistant tasked with processing and responding to user queries based strictly on the provided "Context."

**Instructions:**
1.  Carefully analyze the "Context" provided.
2.  **Your responses must be derived entirely and exclusively from the information present in the "Context."** Do not introduce any outside knowledge or fabricate details.
3.  If the "Context" does not contain sufficient information to fulfill the user's request (e.g., answer a question, provide a summary, or extract specific details), respond with: "I'm sorry, but the information needed for that request is not available in the provided document."
4.  Maintain a professional and clear tone.
5.  Address only the content related to the provided "Context." If the user's query falls outside of the document's scope, politely redirect them by stating you can only assist with the provided information.
        `

export async function POST(req: Request) {
    const {messages} = await req.json();

    const lastUserMessage = messages
        .filter((m: { role: string; content: string }) => m.role === 'user')
        .at(-1)?.content;

    // 1. Get ChromaDB context
    const contextText = await queryPDF(lastUserMessage || '');
    console.log(`Context from ChromaDB: ${contextText}`);


    // 2. Send message with Chroma context to OpenAI
    const result = streamText({
        model: openai('gpt-4o-mini'),
        // system: `
        //     You are a precise and helpful AI assistant tasked with processing and responding to user queries based strictly on the provided "Context."
        //      "Context": "${contextText}"
        //
        //     **Instructions:**
        //     1.  Carefully analyze the "Context" provided.
        //     2.  **Your responses must be derived entirely and exclusively from the information present in the "Context."** Do not introduce any outside knowledge or fabricate details.
        //     3.  If the "Context" does not contain sufficient information to fulfill the user's request (e.g., answer a question, provide a summary, or extract specific details), respond with: "I'm sorry, but the information needed for that request is not available in the provided document."
        //     4.  Maintain a professional and clear tone.
        //     5.  Address only the content related to the provided "Context." If the user's query falls outside of the document's scope, politely redirect them by stating you can only assist with the provided information.
        // `,
        system: `You are a helpful assistant, but you may only use the following knowledge to answer, if helpful:\n\n${contextText}`,
        messages,
    });

    return result.toDataStreamResponse();
}
