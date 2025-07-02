import {PDFLoader} from "@langchain/community/document_loaders/fs/pdf";
import {Document} from "@langchain/core/documents";
import {PDFDocument} from "pdf-lib";
import {readFile} from "node:fs/promises";
import {generateText} from "ai";
import {openai} from "@ai-sdk/openai";
import path from "path";


export async function getPdfContent(filePath: string): Promise<Document<Record<string, any>>[]> {
    const loader = new PDFLoader(filePath);
    return await loader.load();
}

export const splitPdfContent = async (filePath: string): Promise<number> => {
    const documentAsBytes = await readFile(filePath);
    const pdfDoc = await PDFDocument.load(documentAsBytes);
    const numberOfPages = pdfDoc.getPages().length;
    console.log(numberOfPages);
    return numberOfPages;
};

export const generateContentFromPdfPage = async (
    pdfPageBuffer: Buffer,
    pageNumber: number // Optional: for logging/metadata
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
            model: openai('gpt-4o'), // Or google('gemini-1.5-flash')
            system: systemPrompt,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'file',
                            data: pdfPageBuffer, // Directly pass the Buffer of the single-page PDF
                            mimeType: "application/pdf",
                        }
                    ]
                }
            ],
            // Optional: Adjust maxTokens if you expect very dense pages
            // maxTokens: 4000,
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

    const documentsToChunk: Document[] = [];

    for (let i = 0; i < numberOfPages; i++) {
        const newPdfDoc = await PDFDocument.create();
        const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]); // Copy one page at a time
        newPdfDoc.addPage(copiedPage);

        // Serialize the single-page PDF document to bytes (Buffer)
        const singlePagePdfBytes = await newPdfDoc.save();
        const singlePagePdfBuffer = Buffer.from(singlePagePdfBytes);

        const pageText = await generateContentFromPdfPage(singlePagePdfBuffer, i + 1);
        documentsToChunk.push(new Document({
            pageContent: pageText,
            metadata: {
                source: filePath,
                page: i + 1, // Store the page number
                documentId: path.basename(filePath, '.pdf'), // A unique ID for the original document
                // Add any other relevant metadata here
            },
        }));

        // --- Store in Vector DB (Conceptual) ---
        // At this point, `pageText` holds the extracted text for the current page.
        // You would perform your chunking, embedding generation, and vector DB storage here.
        // For example:
        // const chunks = yourTextSplitter(pageText); // Use a text splitter
        // for (const chunk of chunks) {
        //     const embedding = await generateEmbeddings({ model: openai('text-embedding-3-small'), values: [chunk] });
        //     await yourVectorDBClient.upsert({
        //         id: `doc_id_${i + 1}_${chunkIndex}`, // Unique ID for each chunk
        //         values: embedding.embeddings[0],
        //         metadata: {
        //             documentId: 'your_document_unique_id',
        //             pageNumber: i + 1,
        //             originalFilePath: filePath,
        //             text: chunk // Store the chunked text as well
        //         }
        //     });
        // }
        // ----------------------------------------
    }

    console.log(`Finished processing ${numberOfPages} pages.`);
    return documentsToChunk;
};