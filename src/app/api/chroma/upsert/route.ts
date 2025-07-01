import {generateChunks} from "@/src/lib/ai/embeddings";
import {getPdfContent} from "@/src/lib/pdf/pdfLoader";
import {getPDFCollection} from "@/src/lib/db/chroma";

export async function POST() {
    const content = await getPdfContent()
    const chunks = await generateChunks(content);
    if (chunks?.length > 0) {
        const collection = await getPDFCollection();
        const ids = chunks.map((_, i) => `chunk-${i}`);
        const metadatas = chunks.map((_, i) => ({index: i}));

        await collection.add({
            ids,
            documents: chunks.map(c => c.pageContent),
            metadatas: metadatas,
        })
    }
    return new Response(JSON.stringify({added: chunks.length}));
}
