import path from 'path';
import {PDFLoader} from "@langchain/community/document_loaders/fs/pdf";
import {Document} from "@langchain/document";

export async function getPdfContent(): Promise<Document<Record<string, any>>[]> {
    const filePath = path.resolve(process.cwd(), 'mock.pdf');
    const loader = new PDFLoader(filePath);
    return await loader.load();
}