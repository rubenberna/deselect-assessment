import {RecursiveCharacterTextSplitter} from "@langchain/textsplitters";
import {OpenAIEmbeddingFunction} from "@chroma-core/openai";
import {Document} from "@langchain/core/documents";

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

