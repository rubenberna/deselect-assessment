import {ChromaClient} from 'chromadb';
import {OpenAIEmbeddingFunction} from '@chroma-core/openai';

const client = new ChromaClient({path: 'http://localhost:8000'});

const embedder = new OpenAIEmbeddingFunction({
    apiKey: process.env.OPENAI_API_KEY!,
    modelName: "text-embedding-3-small",
});

export async function getCollection() {
    try {
        return await client.getCollection({name: 'my_collection'});
    } catch {
        return await client.createCollection({
            name: 'my_collection',
            // embeddingFunction: embedder,
        });
    }
}


export async function queryChromaRelevantDocs(query: string) {
    const collection = await getCollection();
    const result = await collection.query({
        queryTexts: [query],
        nResults: 3,
        include: ['documents'],
    });

    return result.documents?.[0]?.join('\n\n') ?? '';
}