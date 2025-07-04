'use client';

import {PdfIcon} from "@/src/components/icons";

export const LoadingPDF = () => {

  return (
    <div className="flex items-center justify-center h-screen bg-white dark:bg-zinc-900">
      <div
        className="justify-center bg-zinc-600 w-100 dark:bg-zinc-800 text-white p-4 rounded-lg shadow-lg flex items-center gap-2">
        <div className="w-full flex items-start">
          <PdfIcon/>

        </div>
      </div>
    </div>
  );
};
