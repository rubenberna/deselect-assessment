import {memo} from "react";
import {SendIcon} from "@/src/components/icons";

interface IProps {
  input: string;
  changeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const NewMessageForm = memo((props: IProps) => {
  const {input, changeInput, handleSubmit} = props;

  return (
    <form
      className="flex flex-row gap-2 relative items-center w-full md:max-w-[500px] max-w-[calc(100dvw-32px) px-4 md:px-0"
      onSubmit={handleSubmit}
    >
      <input
        className="bg-zinc-100 rounded-md px-2 py-1.5 flex-1 outline-none dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300"
        placeholder="Send a message..."
        autoFocus
        value={input}
        onChange={changeInput}
      />
      <div
        className="relative text-sm bg-zinc-100 rounded-lg size-9 flex-shrink-0 flex flex-row items-center justify-center cursor-pointer hover:bg-zinc-200 dark:text-zinc-50 dark:bg-zinc-700 dark:hover:bg-zinc-800"
      >
        <SendIcon/>
      </div>
    </form>
  )
})