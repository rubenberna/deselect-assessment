import path from "path";
import {generateChunks} from "@/src/lib/ai/embeddings";
import {processFullPdfDocument} from "@/src/lib/ai/pdfLoader";
import {getPDFCollection} from "@/src/lib/db/chroma";


const jobStatuses: Record<string, {
    status: string;
    progress: number;
    totalPages: number;
    result?: any;
    error?: string
}> = {};

export async function POST() {
    const collection = await getPDFCollection();
    const count = await collection.count();

    if (!count) {
        const realPath = path.resolve(process.cwd(), 'real.pdf');
        const expensiveContent = await processFullPdfDocument(realPath)
        const chunks = await generateChunks(expensiveContent);
        console.log(chunks)
        if (chunks?.length > 0) {
            const ids = chunks.map((chunk, i) => `pdf-p${chunk.metadata.loc.pageNumber || 0}-c${i}`);
            const metadatas = chunks.map(({metadata}, i) => ({
                source: metadata.source,
                pageNumber: metadata.loc.pageNumber
            }));

            await collection.add({
                ids,
                documents: chunks.map(c => c.pageContent),
                metadatas,
            })
        }
        return new Response(JSON.stringify({added: chunks.length}));
    }
    return new Response(JSON.stringify({added: count}));
}
