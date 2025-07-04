import {RecursiveCharacterTextSplitter} from "@langchain/textsplitters";
import {OpenAIEmbeddingFunction} from "@chroma-core/openai";
import {Document} from "@langchain/core/documents";
import {embedMany} from "ai";
import {openai} from "@ai-sdk/openai";

export const embedder = new OpenAIEmbeddingFunction({
  apiKey: process.env.OPENAI_API_KEY!,
  modelName: "text-embedding-3-small",
});

export const generateChunks = async (
  docs: Document[],
): Promise<Document[]> => {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  return await textSplitter.splitDocuments(docs);
}

//Direct embedding of text for custom pipelines
// automatically splits large requests into smaller chunks if the model has a limit on how many embeddings can be generated in a single call.
export const createEmbeddingsFromChunks = async (chunks: Document[]) => {
  return await embedMany({
    model: openai.embedding("text-embedding-3-small"),
    values: chunks.map((chunk) => chunk.pageContent),
  });
}
