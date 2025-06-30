import {embedMany} from 'ai';
import {openai} from '@ai-sdk/openai';
import {RecursiveCharacterTextSplitter} from "@langchain/textsplitters";

export const generateChunks = async (
    content: string,
): Promise<Record<string, any>[]> => {
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
    });
    return await textSplitter.createDocuments([content]);
}

export const generateEmbeddings = async (
    chunkedContent: Array<Record<string, any>[]>,
): Promise<Array<{ embedding: number[]; content: string }>> => {

    console.log(chunkedContent)

    const {embeddings} = await embedMany({
        model: openai.embedding("text-embedding-3-small"),
        values: chunkedContent.map((chunk) => chunk.pageContent),
    });

    return embeddings.map((embedding, index) => ({
        embedding,
        content: chunkedContent[index]?.pageContent,
    }));
};
