import {getCollection} from "@/src/lib/db/chroma";
import fs from 'fs/promises';
import path from 'path';
import {generateChunks} from "@/src/lib/ai/embeddings";

export async function POST() {
    const filePath = path.resolve(process.cwd(), 'facts.txt');
    const raw = await fs.readFile(filePath, 'utf8');

    const chunks = generateChunks(raw);
    const collection = await getCollection();

    const ids = chunks.map((_, i) => `fact-${i}`);
    const metadatas = chunks.map((_, i) => ({index: i}));

    await collection.add({
        ids,
        documents: chunks,
        metadatas,
    });

    return new Response(JSON.stringify({added: chunks.length}));
}
