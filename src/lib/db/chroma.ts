import {ChromaClient} from 'chromadb';
import {embedder} from "@/src/lib/ai/embeddings";
import {Document} from "@langchain/core/documents";

const client = new ChromaClient({path: 'http://localhost:8000'});

export async function getPDFCollection() {
    // await client.deleteCollection({
    //     name: 'pdf_data',
    // })

    return await client.getOrCreateCollection({
        name: 'pdf_data',
        embeddingFunction: embedder,
    })
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

export async function insertPDFChunks(chunks: Document[]) {
    const collection = await getPDFCollection();
    const ids = chunks.map((chunk, i) => `pdf-p${chunk.metadata.page || 0}-c${i}`);
    const documents = chunks.map(chunk => chunk.pageContent);
    const metadatas = chunks.map(({metadata}) => ({
        source: metadata.source,
        pageNumber: metadata.page,
        documentId: metadata.documentId,
    }));

    return await collection.add({
        ids,
        documents,
        metadatas,
    });
}