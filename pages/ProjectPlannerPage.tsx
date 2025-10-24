
import React, { useState, useCallback } from 'react';
import PromptInput from '../components/PromptInput';
import PlanDisplay from '../components/PlanDisplay';
import { generatePlan } from '../services/geminiService';
import { PROMPT_TEMPLATE, INITIAL_GUIDELINES } from '../constants';

const ProjectPlannerPage: React.FC = () => {
  const [guidelines, setGuidelines] = useState<string>(INITIAL_GUIDELINES);
  const [plan, setPlan] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePlan = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setPlan('');

    try {
      const fullPrompt = PROMPT_TEMPLATE.replace('<insert Guidelines.md content here>', guidelines);
      const result = await generatePlan(fullPrompt);
      setPlan(result);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [guidelines]);

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-px bg-gray-700/50">
      <div className="bg-gray-900/80 p-6 overflow-y-auto">
        <PromptInput
          guidelines={guidelines}
          onGuidelinesChange={setGuidelines}
          onGenerate={handleGeneratePlan}
          isLoading={isLoading}
        />
      </div>
      <div className="bg-gray-800/50 p-6 overflow-y-auto">
        <PlanDisplay plan={plan} isLoading={isLoading} error={error} />
      </div>
    </div>
  );
};

export default ProjectPlannerPage;
