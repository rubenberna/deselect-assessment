import {openai} from '@ai-sdk/openai';
import {streamText} from 'ai';
import {queryChromaRelevantDocs} from "@/src/lib/db/chroma";

export const maxDuration = 30;

export async function POST(req: Request) {
    const {messages} = await req.json();

    const lastUserMessage = messages
        .filter((m: { role: string; content: string }) => m.role === 'user')
        .at(-1)?.content;

    // 1. Get ChromaDB context
    const contextText = await queryChromaRelevantDocs(lastUserMessage || '');
    console.log(`Context from ChromaDB: ${contextText}`);


    // 2. Send message with Chroma context to OpenAI
    const result = streamText({
        model: openai('gpt-4o-mini'),
        system: `You are a helpful assistant, but you may only use the following knowledge to answer, if helpful:\n\n${contextText}`,
        messages,
    });

    return result.toDataStreamResponse();
}
