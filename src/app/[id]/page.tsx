import {getChatById} from "@/src/lib/db/supabase";
import Chat from "@/src/components/chat";

export default async function Page({params}: { params: any }) {
  const {id} = await params;
  const chatFromDb = await getChatById({id});

  if (!chatFromDb) {
    return <div className="flex h-screen w-screen items-center justify-center">Chat not found</div>;
  }

  return (
    <Chat
      initialMessages={chatFromDb?.messages}/>
  );
}