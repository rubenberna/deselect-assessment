import {generateChunks, generateEmbeddings} from "@/src/lib/ai/embeddings";
import {getPdfContent} from "@/src/lib/pdf";
import {getCollection} from "@/src/lib/db/chroma";

export async function POST() {
    const content = await getPdfContent()
    const chunks = await generateChunks(content);
    const embeddings = await generateEmbeddings(chunks)

    const collection = await getCollection();
    const ids = chunks.map((_, i) => `chunk-${i}`);
    const metadatas = chunks.map((_, i) => ({index: i}));

    await collection.add({
        ids,
        embeddings: embeddings.map(e => e.embedding),
        documents: chunks.map(c => c.pageContent),
        metadatas: metadatas,
    })

    return new Response(JSON.stringify({added: chunks.length}));
}
