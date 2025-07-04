# Project Documentation

## Technology Stack

This project leverages the following technologies:

- **TypeScript**: For type-safe development.
- **Next**: Frontend framework for building the user interface.
- **Node.js**: Backend runtime environment.
- **ChromaDB**: Vector database for storing and querying embeddings.
- **Supabase**: Relational db for storing messages history.
- **@ai-sdk**: A TypeScript SDK for building AI-powered applications.

---

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
    ```

2. **Install Dependencies: Ensure you have pnpm or yarn installed. Run**:

```
npm install
```

3. **Set Up Environment Variables: Create a .env file in the root directory and configure the following variables**:

```
OPENAI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Running Instructions

1. **Start ChromaDB: Ensure ChromaDB is running locally on Docker**:

```
docker run -v ./chroma-data:/data -p 8000:8000 chromadb/chroma
```

2. **Start the Development Server**:
   ```bash
   npm run dev
   ```

## Chunking Instructions

The text chunking strategy involves splitting the PDF content into pages. Each page is converted into a Buffer and fed
into *gpt-4o* to extract its text.
The extracted text is then chunked into smaller segments (500 tokens with overlap 100) and uses a
custom embedding strategy (*embedMany*) for a finer control over batching/chunking and ability to embed more control.
This process ensures that each segment retains enough context for accurate querying.

The embeddings are stored in ChromaDB for efficient querying.

This strategy was chosen for several reasons:

- Efficient embedding generation.
- Improved query accuracy by preserving contextual information.
- Scalability for large documents.
- The chunking size was chosen to balance embedding quality and database performance.