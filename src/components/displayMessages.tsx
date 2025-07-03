import {RefObject} from "react";
import {Message} from "ai";
import {Message as PreviewMessage} from "@/src/components/message";

interface IProps {
  messagesContainerRef: RefObject<HTMLDivElement | null>
  messagesEndRef: RefObject<HTMLDivElement | null>
  messages: Message[]
}

export const DisplayMessages = (props: IProps) => {
  const {messagesContainerRef, messagesEndRef, messages} = props;

  return (
    <div
      ref={messagesContainerRef}
      className="flex flex-col gap-4 h-full w-dvw items-center overflow-y-scroll"
    >
      {messages.map((message, index) => (
        <PreviewMessage
          key={`${'id'}-${index}`}
          role={message.role}
          content={message.content}
        />
      ))}
      <div
        ref={messagesEndRef}
        className="flex-shrink-0 min-w-[24px] min-h-[24px]"
      />
    </div>
  )
}