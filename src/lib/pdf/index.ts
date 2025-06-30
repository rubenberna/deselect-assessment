import fs from 'fs/promises';
import path from 'path';
import pdf from 'pdf-parse';

export async function getPdfContent(): Promise<string> {
    const filePath = path.resolve(process.cwd(), 'data_source.pdf');
    const dataBuffer = await fs.readFile(filePath);
    const result = await pdf(dataBuffer);
    return result.text;
}
