import {Document} from "@langchain/core/documents";
import {PDFDocument} from "pdf-lib";
import {readFile} from "node:fs/promises";
import path from "path";
import pLimit from 'p-limit';
import {generateContentFromPdfPage} from "@/src/lib/ai/pdfContent";

export const processFullPdfDocument = async (filePath: string): Promise<Document[]> => {

  const documentAsBytes = await readFile(filePath);
  const pdfDoc = await PDFDocument.load(documentAsBytes);
  const numberOfPages = pdfDoc.getPages().length;
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