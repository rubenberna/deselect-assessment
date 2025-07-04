'use client';

import {useEffect, useState} from "react";
import {PdfIcon} from "@/src/components/icons";
import useSWR from "swr";
import {fetcher} from "@/src/lib/utils/functions";


const intervalDurationMs = 6000; // Default interval duration
export const LoadingPDF = () => {
  // const [messages, setMessages] = useState<string[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const {data: messages, isLoading} = useSWR('/api/loadingMessages', fetcher)


  useEffect(() => {
    if (messages?.length > 0) {
      const interval = setInterval(() => {
        setCurrentMessageIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          return nextIndex < messages.length ? nextIndex : 0;
        });
      }, intervalDurationMs);

      return () => clearInterval(interval);
    }
  }, [messages]);


  const displayedMessage = isLoading
    ? "Loading up the fun..." // Initial message while AI generates
    : messages[currentMessageIndex] || "Still loading, hang in there!"; // Fallback

  return (
    <div className="animate-pulse flex items-center justify-center h-screen bg-white dark:bg-zinc-900">
      <div
        className="justify-center bg-zinc-600 w-100 dark:bg-zinc-800 text-white p-4 rounded-lg shadow-lg flex items-center gap-2">
        <div className="w-full flex items-center gap-2">
          <PdfIcon/>
          <p className="text-xs ">{displayedMessage}</p>
        </div>
      </div>
    </div>
  );
};
