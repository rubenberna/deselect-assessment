import {openai} from '@ai-sdk/openai';
import {streamText} from 'ai';
import {getCollection} from '@/src/lib/db/chroma';

export const maxDuration = 30;

export async function POST(req: Request) {
    const {messages} = await req.json();

    const lastUserMessage = messages
        .filter((m: { role: string; content: string }) => m.role === 'user')
        .at(-1)?.content;

    // 1. Get ChromaDB context
    const collection = await getCollection();

    const chromaResult = await collection.query({
        queryTexts: [lastUserMessage],
        nResults: 3,
        include: ['documents'],
    });

    const contextText = chromaResult.documents?.[0]?.join('\n\n') ?? '';

    // 2. Send message with Chroma context to OpenAI
    const result = streamText({
        model: openai('gpt-4o-mini'),
        system: `You are a helpful assistant. Use only following knowledge to answer if helpful:\n\n${contextText}`,
        messages,
    });

    return result.toDataStreamResponse();
}
