import {generateFunnyLoadingMessages} from "@/src/lib/ai/loadingMessages";

export async function GET() {
  const loadingMessages = await generateFunnyLoadingMessages()

  return Response.json(loadingMessages)
}