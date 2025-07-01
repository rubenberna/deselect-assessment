import {ChromaClient} from 'chromadb';
import {embedder} from "@/src/lib/ai/embeddings";

const client = new ChromaClient({path: 'http://localhost:8000'});

export async function getPDFCollection() {
    try {
        return await client.getCollection({name: 'pdf_data'});
    } catch {
        return await client.createCollection({
            name: 'pdf_data',
            embeddingFunction: embedder,
        });
    }
}

export async function queryPDF(query: string) {
    const collection = await getPDFCollection();
    const result = await collection.query({
        queryTexts: [query],
        nResults: 1,
        include: ['documents'],
    });

    return result.documents?.[0]?.join('\n\n') ?? '';
}