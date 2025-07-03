import {CoreMessage} from "ai";
import {createBrowserClient} from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export const createMessage = async ({messages, id, author}: {
  messages: CoreMessage[];
  id: string;
  author?: string;
}) => {

  const client = createClient();

  const {error} = await client
    .from('chat')
    .upsert({
      id,
      messages,
      author
    }, {onConflict: 'id'});

  if (error) {
    console.error("Error creating message:", error);
    throw error;
  }
}

export const getChatsByUser = async ({userId}: { userId: string }) => {
  const client = createClient();

  const {data, error} = await client
    .from('chat')
    .select('*')
    .eq('author', userId)
    .order('created_at', {ascending: false});

  if (error) {
    console.error("Error fetching chats by user:", error);
    throw error;
  }

  return data;
}

export const getChatById = async ({id}: { id: string }) => {
  const client = createClient();

  const {data, error} = await client
    .from('chat')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error fetching chat by ID:", error);
    throw error;
  }

  return data;
}