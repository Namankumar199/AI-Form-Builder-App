"use client"
import React, { useState } from 'react';
import { Button } from './button';
import { Progress } from './progress';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

export const MultiStepForm = ({ 
  steps, 
  onSubmit, 
  onStepChange,
  className = "" 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const goToStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex);
      onStepChange?.(stepIndex);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      goToStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    goToStep(currentStep - 1);
  };

  const handleSubmit = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    onSubmit?.();
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            {steps[currentStep]?.title || `Step ${currentStep + 1}`}
          </h2>
          <span className="text-sm text-gray-500">
            {currentStep + 1} of {steps.length}
          </span>
        </div>
        
        <Progress value={progress} className="h-2 mb-4" />
        
        {/* Step Indicators */}
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center space-x-2 cursor-pointer transition-all duration-200 ${
                index <= currentStep ? 'text-teal-600' : 'text-gray-400'
              }`}
              onClick={() => index <= currentStep && goToStep(index)}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                completedSteps.has(index)
                  ? 'bg-green-500 border-green-500 text-white'
                  : index === currentStep
                  ? 'border-teal-500 bg-teal-50 text-teal-600'
                  : index < currentStep
                  ? 'border-teal-300 bg-teal-100 text-teal-600'
                  : 'border-gray-300 bg-gray-50 text-gray-400'
              }`}>
                {completedSteps.has(index) ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <span className="text-sm font-medium hidden sm:block">
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-teal-100 p-6 mb-6 min-h-[400px]">
        {steps[currentStep]?.description && (
          <p className="text-gray-600 mb-6">{steps[currentStep].description}</p>
        )}
        
        <div className="space-y-4">
          {steps[currentStep]?.content}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <div className="flex space-x-2">
          {currentStep < steps.length - 1 ? (
            <Button
              onClick={nextStep}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 flex items-center space-x-2"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 flex items-center space-x-2"
            >
              <Check className="h-4 w-4" />
              <span>Submit</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper to split form fields into steps
export const createStepsFromFields = (fields, fieldsPerStep = 3) => {
  const steps = [];
  
  for (let i = 0; i < fields.length; i += fieldsPerStep) {
    const stepFields = fields.slice(i, i + fieldsPerStep);
    steps.push({
      title: `Step ${Math.floor(i / fieldsPerStep) + 1}`,
      description: `Please fill out the following information`,
      fields: stepFields
    });
  }
  
  return steps;
};