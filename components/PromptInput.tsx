
import React from 'react';
import { SpinnerIcon, WandSparklesIcon } from './icons';

interface PromptInputProps {
  guidelines: string;
  onGuidelinesChange: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({
  guidelines,
  onGuidelinesChange,
  onGenerate,
  isLoading,
}) => {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold text-cyan-400 mb-1">
        System Guidelines
      </h2>
      <p className="text-sm text-gray-400 mb-4">
        Paste your system requirements below. The AI will use these guidelines to generate a detailed project plan.
      </p>
      <div className="flex-grow">
        <textarea
          value={guidelines}
          onChange={(e) => onGuidelinesChange(e.target.value)}
          placeholder="Enter your system guidelines here..."
          className="w-full h-full min-h-96 resize-y p-4 bg-gray-900/70 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 text-gray-300 text-sm leading-6"
          spellCheck="false"
        />
      </div>
      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="mt-6 w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isLoading ? (
          <>
            <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
            Generating...
          </>
        ) : (
          <>
            <WandSparklesIcon className="-ml-1 mr-2 h-5 w-5" />
            Generate Plan
          </>
        )}
      </button>
    </div>
  );
};

export default PromptInput;
