'use client';

import {ChangeEvent, useCallback} from "react";
import {useChat} from "@ai-sdk/react";
import useSWR from "swr";
import {useScrollToBottom} from "@/src/components/use-scroll-to-bottom";
import {fetcher} from "@/src/lib/utils/functions";
import {LoadingPdf} from "@/src/components/loadingPdf";
import {SuggestedMessages} from "@/src/components/suggestedMessages";
import {NewMessageForm} from "@/src/components/newMessageForm";
import {MessagesBoard} from "@/src/components/messagesBoard";
import {Message} from "ai";

interface ChatProps {
  id: string | null;
  initialMessages: Array<Message>;
}

export default function Chat(props: ChatProps) {
  const {id, initialMessages} = props;

  const {messages, input, setInput, handleSubmit, append} = useChat({
    initialMessages,
    onFinish: () => {
      window.history.replaceState({}, "", `/${id}`);
    },
  })
  const {isLoading} = useSWR('/api/loadPdf', fetcher)

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const changeInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }, []);

  return (
    <div className="flex flex-row justify-center pb-20 h-dvh bg-white dark:bg-zinc-900">
      <div className="flex flex-col justify-between items-center gap-4">
        <MessagesBoard
          messagesContainerRef={messagesContainerRef}
          messagesEndRef={messagesEndRef}
          messages={messages}
        />

        {isLoading ?
          <LoadingPdf/> :
          <>
            {!messages?.length && (
              <SuggestedMessages append={append}/>
            )}
            <NewMessageForm
              input={input}
              changeInput={changeInput}
              handleSubmit={handleSubmit}/>
          </>
        }
      </div>
    </div>
  )
}
