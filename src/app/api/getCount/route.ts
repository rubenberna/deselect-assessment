import {getPDFCollection} from "@/src/lib/db/chroma";
import {NextResponse} from "next/server";


export async function GET() {
  const collection = await getPDFCollection();
  const count = await collection.count();

  return NextResponse.json(count);
}