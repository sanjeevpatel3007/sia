'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Calendar, Brain, Search, CheckCircle, Clock, Sparkles } from 'lucide-react';

interface LoadingStepsProps {
  questionType: 'calendar' | 'wellness' | 'general' | 'planning';
  isActive: boolean;
}

export default function LoadingSteps({ questionType, isActive }: LoadingStepsProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Define different step sequences based on question type
  const stepConfigurations = useCallback(() => ({
    calendar: [
      { id: 'analyze', label: 'Analyzing your calendar request', icon: <Calendar className="w-4 h-4" /> },
      { id: 'search', label: 'Searching your calendar events', icon: <Search className="w-4 h-4" /> },
      { id: 'process', label: 'Processing schedule data', icon: <Brain className="w-4 h-4" /> },
      { id: 'wellness', label: 'Finding wellness opportunities', icon: <Sparkles className="w-4 h-4" /> },
      { id: 'complete', label: 'Preparing your response', icon: <CheckCircle className="w-4 h-4" /> }
    ],
    wellness: [
      { id: 'analyze', label: 'Understanding your wellness needs', icon: <Brain className="w-4 h-4" /> },
      { id: 'search', label: 'Searching wellness resources', icon: <Search className="w-4 h-4" /> },
      { id: 'personalize', label: 'Personalizing guidance for you', icon: <Sparkles className="w-4 h-4" /> },
      { id: 'complete', label: 'Preparing wellness recommendations', icon: <CheckCircle className="w-4 h-4" /> }
    ],
    planning: [
      { id: 'analyze', label: 'Analyzing your planning request', icon: <Brain className="w-4 h-4" /> },
      { id: 'organize', label: 'Organizing information', icon: <Clock className="w-4 h-4" /> },
      { id: 'structure', label: 'Structuring your plan', icon: <Sparkles className="w-4 h-4" /> },
      { id: 'complete', label: 'Finalizing recommendations', icon: <CheckCircle className="w-4 h-4" /> }
    ],
    general: [
      { id: 'analyze', label: 'Understanding your question', icon: <Brain className="w-4 h-4" /> },
      { id: 'search', label: 'Gathering relevant information', icon: <Search className="w-4 h-4" /> },
      { id: 'complete', label: 'Preparing your response', icon: <CheckCircle className="w-4 h-4" /> }
    ]
  }), []);

  // Compute steps with current state
  const steps = useMemo(() => {
    if (!isActive) return [];
    
    const currentSteps = stepConfigurations()[questionType];
    return currentSteps.map((step, index) => ({
      ...step,
      completed: index < currentStepIndex,
      active: index === currentStepIndex
    }));
  }, [isActive, questionType, currentStepIndex, stepConfigurations]);

  // Handle step progression
  useEffect(() => {
    if (!isActive) {
      const timeoutId = setTimeout(() => setCurrentStepIndex(0), 0);
      return () => clearTimeout(timeoutId);
    }

    const timeoutId = setTimeout(() => setCurrentStepIndex(0), 0);
    const currentSteps = stepConfigurations()[questionType];
    const stepInterval = setInterval(() => {
      setCurrentStepIndex(prev => {
        const next = prev + 1;
        if (next >= currentSteps.length) {
          clearInterval(stepInterval);
          return prev;
        }
        return next;
      });
    }, 800);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(stepInterval);
    };
  }, [isActive, questionType, stepConfigurations]);

  if (!isActive || steps.length === 0) return null;

  return (
    <div className="flex justify-start">
      <div className="inline-flex max-w-[90%] bg-[hsl(47,71%,90%)] text-[hsl(218,28%,53%)] p-4 rounded-2xl shadow-sm">
        <div className="space-y-3 w-full">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-[hsl(32,100%,97%)] rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-[hsl(32,100%,97%)] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-[hsl(32,100%,97%)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-sm font-medium">SIA is working on your request...</span>
          </div>
          
          <div className="space-y-2">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center space-x-3 transition-all duration-300 ${
                  step.completed ? 'opacity-100' : step.active ? 'opacity-100' : 'opacity-50'
                }`}
              >
                <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                  step.completed 
                    ? 'bg-green-500 text-white' 
                    : step.active 
                    ? 'bg-[hsl(218,28%,53%)] text-white animate-pulse' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    step.icon
                  )}
                </div>
                <span className={`text-sm transition-all duration-300 ${
                  step.completed 
                    ? 'text-green-600 font-medium' 
                    : step.active 
                    ? 'text-[hsl(218,28%,53%)] font-medium' 
                    : 'text-gray-500'
                }`}>
                  {step.label}
                </span>
                {step.active && (
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-1 bg-[hsl(218,28%,53%)] rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-[hsl(218,28%,53%)] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1 h-1 bg-[hsl(218,28%,53%)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
