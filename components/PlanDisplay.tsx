
import React, { useEffect, useRef, useState } from 'react';
import { ClipboardCheckIcon, ClipboardIcon, BotMessageSquareIcon, TriangleAlertIcon, WandSparklesIcon } from './icons';

interface PlanDisplayProps {
  plan: string;
  isLoading: boolean;
  error: string | null;
}

const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan, isLoading, error }) => {
  const displayRef = useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (plan && displayRef.current) {
      // Type assertion because marked is loaded from CDN
      const marked = (window as any).marked;
      const DOMPurify = (window as any).DOMPurify;

      if (marked && DOMPurify) {
        const dirtyHtml = marked.parse(plan);
        const cleanHtml = DOMPurify.sanitize(dirtyHtml);
        displayRef.current.innerHTML = cleanHtml;
      }
    }
  }, [plan]);

  const handleCopy = () => {
    if (plan) {
      navigator.clipboard.writeText(plan).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
        <BotMessageSquareIcon className="w-16 h-16 text-cyan-500 animate-pulse" />
        <h3 className="mt-4 text-lg font-medium text-gray-200">Generating Your Plan</h3>
        <p className="mt-1 text-sm">The AI is analyzing your guidelines. Please wait a moment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-red-400 bg-red-900/20 rounded-lg p-8">
        <TriangleAlertIcon className="w-16 h-16" />
        <h3 className="mt-4 text-lg font-medium text-red-300">An Error Occurred</h3>
        <p className="mt-1 text-sm">{error}</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
        <WandSparklesIcon className="w-16 h-16" />
        <h3 className="mt-4 text-lg font-medium text-gray-400">Ready to Plan</h3>
        <p className="mt-1 text-sm">Your generated project plan will appear here.</p>
      </div>
    );
  }

  return (
    <div className="relative h-full">
        <button
            onClick={handleCopy}
            className="absolute top-0 right-0 mt-2 mr-2 z-10 p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/70 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            aria-label="Copy to clipboard"
        >
            {isCopied ? (
                <ClipboardCheckIcon className="w-5 h-5 text-green-400" />
            ) : (
                <ClipboardIcon className="w-5 h-5 text-gray-300" />
            )}
        </button>
      <div 
        ref={displayRef} 
        className="prose-custom h-full overflow-y-auto pr-4"
      >
        {/* Content is injected via innerHTML */}
      </div>
      <style>{`
        .prose-custom {
          color: #d1d5db; /* gray-300 */
        }
        .prose-custom h1, .prose-custom h2, .prose-custom h3, .prose-custom h4, .prose-custom h5, .prose-custom h6 {
          color: #ffffff; /* white */
          font-weight: 600;
        }
        .prose-custom h1 { font-size: 1.875rem; margin-top: 1.5em; margin-bottom: 0.75em; }
        .prose-custom h2 { font-size: 1.5rem; margin-top: 1.5em; margin-bottom: 0.75em; border-bottom: 1px solid #4b5563; padding-bottom: 0.25em;}
        .prose-custom h3 { font-size: 1.25rem; margin-top: 1.25em; margin-bottom: 0.5em; }
        .prose-custom p {
          line-height: 1.625;
          margin-top: 1.25em;
          margin-bottom: 1.25em;
        }
        .prose-custom a {
          color: #67e8f9; /* cyan-300 */
          text-decoration: none;
        }
        .prose-custom a:hover {
          text-decoration: underline;
        }
        .prose-custom strong {
          color: #f3f4f6; /* gray-100 */
        }
        .prose-custom blockquote {
          border-left: 0.25em solid #4b5563; /* gray-600 */
          padding-left: 1em;
          font-style: italic;
          color: #9ca3af; /* gray-400 */
        }
        .prose-custom code {
          background-color: #1f2937; /* gray-800 */
          color: #e5e7eb; /* gray-200 */
          padding: 0.2em 0.4em;
          margin: 0;
          font-size: 85%;
          border-radius: 6px;
        }
        .prose-custom pre {
          background-color: #111827; /* gray-900 */
          border: 1px solid #374151; /* gray-700 */
          border-radius: 0.5rem;
          padding: 1rem;
          overflow-x: auto;
          font-size: 0.875rem;
        }
        .prose-custom pre code {
          background-color: transparent;
          padding: 0;
          margin: 0;
        }
        .prose-custom ul, .prose-custom ol {
          margin-top: 1.25em;
          margin-bottom: 1.25em;
          padding-left: 1.625em;
        }
        .prose-custom li {
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }
         .prose-custom table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1.5em;
          margin-bottom: 1.5em;
        }
        .prose-custom th, .prose-custom td {
          border: 1px solid #4b5563; /* gray-600 */
          padding: 0.5em 1em;
        }
        .prose-custom th {
          font-weight: 600;
          background-color: #374151; /* gray-700 */
        }
      `}</style>
    </div>
  );
};

export default PlanDisplay;
