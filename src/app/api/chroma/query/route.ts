// app/api/chroma/query/route.ts
import {NextRequest} from 'next/server';
import {getCollection} from "@/src/lib/db/chroma";

export async function POST(req: NextRequest) {
    const {query} = await req.json();
    const collection = await getCollection();

    const result = await collection.query({
        queryTexts: [query],
        nResults: 1,
    });

    return new Response(JSON.stringify(result));
}
