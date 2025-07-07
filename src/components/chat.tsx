'use client';

import {ChangeEvent, useCallback} from "react";
import {useChat} from "@ai-sdk/react";
import {Message} from "ai";
import {useScrollToBottom} from "@/src/hooks/useScrollToBottom";
import {LoadingPDF} from "@/src/components/loadingPdf";
import {SuggestedMessages} from "@/src/components/suggestedMessages";
import {NewMessageForm} from "@/src/components/newMessageForm";
import {MessagesBoard} from "@/src/components/messagesBoard";
import {_useOnMount} from "@/src/hooks/_useOnMount";

interface ChatProps {
  initialMessages: Array<Message>;
}

export default function Chat(props: ChatProps) {
  const {initialMessages} = props;

  const {messages, input, setInput, handleSubmit, append} = useChat({
    initialMessages,
  })
  const {isLoadingPdf} = _useOnMount()

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const changeInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }, []);

  if (isLoadingPdf) {
    return <LoadingPDF/>
  }
  return (
    <div className="flex flex-row justify-center pb-20 h-dvh bg-white dark:bg-zinc-900">
      <div className="flex flex-col justify-between items-center gap-4">
        <MessagesBoard
          messagesContainerRef={messagesContainerRef}
          messagesEndRef={messagesEndRef}
          messages={messages}
        />
        {!messages?.length && (
          <SuggestedMessages append={append}/>
        )}
        <NewMessageForm
          input={input}
          changeInput={changeInput}
          handleSubmit={handleSubmit}/>
      </div>
    </div>
  )
}
