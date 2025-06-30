'use client';

import {useChat} from "@ai-sdk/react";
import {useEffect, useState} from 'react'
import {FileIcon} from "@/src/components/icons";
import {AnimatePresence, motion} from "framer-motion";
import {useScrollToBottom} from "@/src/components/use-scroll-to-bottom";
import {Message as PreviewMessage} from "@/src/components/message";
import {Files} from "@/src/components/files";

const suggestedActions = [
    {
        title: "What's the summary",
        label: "of these documents?",
        action: "what's the summary of these documents?",
    },
    {
        title: "Who is the author",
        label: "of these documents?",
        action: "who is the author of these documents?",
    },
];


export default function Home() {
    const {messages, input, setInput, handleSubmit, append} = useChat({})
    const [selectedFilePathnames, setSelectedFilePathnames] = useState<
        Array<string>
    >([]);
    const [isFilesVisible, setIsFilesVisible] = useState(false);

    const [messagesContainerRef, messagesEndRef] =
        useScrollToBottom<HTMLDivElement>();

    useEffect(() => {
        (async () => {
            await fetch('/api/chroma/upsert', {
                method: 'POST',
            })
        })()
    }, [])

    const handleQuery = async () => {
        const res = await fetch('/api/chroma/query', {
            method: 'POST',
            body: JSON.stringify({query: 'What is the longest English word?'}),
            headers: {'Content-Type': 'application/json'},
        });
        const json = await res.json();
        console.log(json);
    };

    return (
        <div className="flex flex-row justify-center pb-20 h-dvh bg-white dark:bg-zinc-900">
            <div className="flex flex-col justify-between items-center gap-4">
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

                {messages.length === 0 && (
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
                )}

                <form
                    className="flex flex-row gap-2 relative items-center w-full md:max-w-[500px] max-w-[calc(100dvw-32px) px-4 md:px-0"
                    onSubmit={handleSubmit}
                >
                    <input
                        className="bg-zinc-100 rounded-md px-2 py-1.5 flex-1 outline-none dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300"
                        placeholder="Send a message..."
                        value={input}
                        onChange={(event) => {
                            setInput(event.target.value);
                        }}
                    />
                    <button
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                        onClick={handleQuery}>
                        Try me
                    </button>
                    <div
                        className="relative text-sm bg-zinc-100 rounded-lg size-9 flex-shrink-0 flex flex-row items-center justify-center cursor-pointer hover:bg-zinc-200 dark:text-zinc-50 dark:bg-zinc-700 dark:hover:bg-zinc-800"
                        onClick={() => {
                            setIsFilesVisible(!isFilesVisible);
                        }}
                    >
                        <FileIcon/>

                        <motion.div
                            className="absolute text-xs -top-2 -right-2 bg-blue-500 size-5 rounded-full flex flex-row justify-center items-center border-2 dark:border-zinc-900 border-white text-blue-50"
                            initial={{opacity: 0, scale: 0.5}}
                            animate={{opacity: 1, scale: 1}}
                            transition={{delay: 0.5}}
                        >
                            {selectedFilePathnames?.length}
                        </motion.div>
                    </div>
                </form>
            </div>

            <AnimatePresence>
                {isFilesVisible && (
                    <Files
                        setIsFilesVisible={setIsFilesVisible}
                        selectedFilePathnames={selectedFilePathnames}
                        setSelectedFilePathnames={setSelectedFilePathnames}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}
