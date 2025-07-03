import {openai} from '@ai-sdk/openai';
import {streamText} from 'ai';
import {queryPDF} from "@/src/lib/db/chroma";
import {getUserIdFromCookies} from "@/src/lib/utils/cookies";
import {createMessage} from "@/src/lib/db/supabase";

export async function POST(req: Request) {
  const userId = await getUserIdFromCookies()
  const {id, messages} = await req.json();

  const lastUserMessage = messages
    .at(-1)?.content;

  const contextText = await queryPDF(lastUserMessage || '');

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: `
            You are a precise and helpful AI assistant tasked with processing and responding to user queries based on the provided "Context."
             "Context": "${contextText}"

            **Instructions:**
            1.  Carefully analyze the "Context" provided.
            2.  Maintain a professional and clear tone.
            3.  Address only the content related to the provided "Context." If the user's query falls outside of the document's scope, politely redirect them by stating you can only assist with the provided information.
        `,
    messages,
    onFinish: async (context) => {
      await createMessage({
        id,
        messages: [...messages, {role: 'assistant', content: context.text}],
        author: userId
      })
    }
  });

  return result.toDataStreamResponse();
}
