export function chunkText(text: string, size = 200, separator = '\n'): string[] {
    const lines = text.split(separator);
    const chunks: string[] = [];
    let buffer = '';

    for (const line of lines) {
        if ((buffer + line).length > size) {
            chunks.push(buffer.trim());
            buffer = line;
        } else {
            buffer += separator + line;
        }
    }

    if (buffer) chunks.push(buffer.trim());
    return chunks;
}
