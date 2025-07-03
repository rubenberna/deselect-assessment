import path from "path";
import {generateChunks} from "@/src/lib/ai/embeddings";
import {processFullPdfDocument} from "@/src/lib/ai/pdfLoader";
import {getPDFCollection, insertPDFChunks} from "@/src/lib/db/chroma";

export async function GET() {
  const collection = await getPDFCollection();
  const count = await collection.count();

  if (!count) {
    const realPath = path.resolve(process.cwd(), 'real.pdf');
    const expensiveContent = await processFullPdfDocument(realPath)
    const chunks = await generateChunks(expensiveContent);
    if (chunks?.length > 0) {
      await insertPDFChunks(chunks)
    }
    return new Response(JSON.stringify({added: chunks.length}));
  }
  return new Response(JSON.stringify({added: count}));
}
