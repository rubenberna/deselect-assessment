import path from "path";
import {generateChunks} from "@/src/lib/ai/embeddings";
import {insertPDFChunks} from "@/src/lib/db/chroma";
import {processFullPdfDocument} from "@/src/lib/utils/pdf";


export async function GET() {
  const filePath = path.resolve(process.cwd(), 'deselect.pdf');
  const expensiveContent = await processFullPdfDocument(filePath)
  const chunks = await generateChunks(expensiveContent);
  if (chunks?.length > 0) {
    await insertPDFChunks(chunks)
  }
  return new Response(JSON.stringify({added: chunks.length}));
}
