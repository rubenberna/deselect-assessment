import {motion} from "framer-motion";
import {LoaderIcon} from "@/src/components/icons";

export const LoadingPdf = () => {

  return (
    <motion.div
      className="w-fit p-1 px-2 flex font-medium items-center justify-center gap-3 dark:bg-zinc-700 dark:border-zinc-600 text-zinc-100 rounded-md"
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
    >
      <div className="animate-spin">
        <LoaderIcon/>
      </div>
      Loading PDF...
    </motion.div>
  )
}