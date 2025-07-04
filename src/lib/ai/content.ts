import {generateText} from "ai";
import {openai} from "@ai-sdk/openai";

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

