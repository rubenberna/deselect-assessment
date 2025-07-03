import {getUserIdFromCookies} from "@/src/lib/utils/cookies";
import {getChatsByUser} from "@/src/lib/db/supabase";

export async function GET() {
  const userId = await getUserIdFromCookies()

  const chats = await getChatsByUser({userId});
  return Response.json(chats);
}