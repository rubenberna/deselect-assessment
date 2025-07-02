import {Document} from "@langchain/core/documents";
import {PDFDocument} from "pdf-lib";
import {readFile} from "node:fs/promises";
import {generateText} from "ai";
import {openai} from "@ai-sdk/openai";
import path from "path";
import pLimit from 'p-limit';

export const generateContentFromPdfPage = async (
    pdfPageBuffer: Buffer,
    pageNumber: number
): Promise<string> => {
    console.log(`Generating content for page ${pageNumber} with GPT-4o...`);

    const systemPrompt =
        `
        You will be given a single PDF page.
        Please extract all text content from this page.
        Maintain original formatting as much as possible, including line breaks, paragraphs, and list structures.
        Do not add any introductory or concluding remarks, just the raw text content.
        `

    try {
        const {text} = await generateText({
            model: openai('gpt-4o'),
            system: systemPrompt,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'file',
                            data: pdfPageBuffer,
                            mimeType: "application/pdf",
                        }
                    ]
                }
            ],
        });
        console.log(`Content extracted from page ${pageNumber}. Length: ${text.length}`);
        return text;
    } catch (error) {
        console.error(`Error generating content for page ${pageNumber}:`, error);
        return `[ERROR: Could not extract text from page ${pageNumber}]`;
    }
};

// Main function to split and process the entire PDF
export const processFullPdfDocument = async (filePath: string): Promise<Document[]> => {
    console.log(`Starting PDF processing for: ${filePath}`);

    const documentAsBytes = await readFile(filePath);
    const pdfDoc = await PDFDocument.load(documentAsBytes);
    const numberOfPages = pdfDoc.getPages().length;
    console.log(`Total pages in document: ${numberOfPages}`);
    const limit = pLimit(3);

    const pageProcessingTasks: Promise<Document>[] = [];

    for (let i = 0; i < numberOfPages; i++) {
        const newPdfDoc = await PDFDocument.create();
        const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
        newPdfDoc.addPage(copiedPage);

        const singlePagePdfBytes = await newPdfDoc.save();
        const singlePagePdfBuffer = Buffer.from(singlePagePdfBytes);

        pageProcessingTasks.push(limit(async () => {
            const pageText = await generateContentFromPdfPage(singlePagePdfBuffer, i + 1);
            return new Document({
                pageContent: pageText,
                metadata: {
                    source: filePath,
                    page: i + 1,
                    documentId: path.basename(filePath, '.pdf'),
                },
            });
        }));
    }

    const documentsToChunk = await Promise.all(pageProcessingTasks);
    console.log(`Finished processing ${numberOfPages} pages.`);
    return documentsToChunk;
};