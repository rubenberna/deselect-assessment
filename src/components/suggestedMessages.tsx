import {ChatRequestOptions, CreateMessage, Message} from "ai";
import {motion} from "framer-motion";

const suggestedActions = [
  {
    title: "What's the summary",
    label: "of this document?",
    action: "what's the summary of this document?",
  },
  {
    title: "What are the important",
    label: "takeaways of this analysis?",
    action: "what are the important takeaways of this analysis?",
  },
];

type AppendFunction = (message: Message | CreateMessage, chatRequestOptions?: ChatRequestOptions | undefined) => void;

export const SuggestedMessages = ({append}: { append: AppendFunction }) => {

  return (
    <div className="grid sm:grid-cols-2 gap-2 w-full px-4 md:px-0 mx-auto md:max-w-[500px]">
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: 0.05 * index}}
          key={index}
          className={index > 1 ? "hidden sm:block" : "block"}
        >
          <button
            onClick={async () => {
              append({
                role: "user",
                content: suggestedAction.action,
              });
            }}
            className="w-full text-left border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 rounded-lg p-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex flex-col"
          >
            <span className="font-medium">{suggestedAction.title}</span>
            <span className="text-zinc-500 dark:text-zinc-400">
                    {suggestedAction.label}
                  </span>
          </button>
        </motion.div>
      ))}
    </div>

  )
}