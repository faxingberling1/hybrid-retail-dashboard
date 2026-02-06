import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const stepVariants = cva(
  "flex items-center justify-center rounded-full border-2",
  {
    variants: {
      status: {
        completed: "bg-green-500 border-green-500 text-white",
        current: "bg-blue-600 border-blue-600 text-white",
        pending: "bg-white border-gray-300 text-gray-500",
      },
      size: {
        sm: "w-8 h-8 text-sm",
        md: "w-10 h-10 text-base",
        lg: "w-12 h-12 text-lg",
      },
    },
    defaultVariants: {
      size: "md",
      status: "pending",
    },
  }
);

interface StepProps extends VariantProps<typeof stepVariants> {
  number: number;
  children?: React.ReactNode;
  className?: string;
}

export function Step({ number, status, size, className }: StepProps) {
  return (
    <div className={cn(stepVariants({ status, size }), className)}>
      {status === 'completed' ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <span>{number}</span>
      )}
    </div>
  );
}

export function ProgressConnector({ completed }: { completed: boolean }) {
  return (
    <div
      className={`flex-1 h-1 ${completed ? 'bg-blue-600' : 'bg-gray-300'}`}
    />
  );
}

export function IndustryCard({
  id,
  name,
  description,
  icon: Icon,
  selected,
  onClick,
  features,
}: {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  selected: boolean;
  onClick: () => void;
  features: string[];
}) {
  return (
    <div
      className={cn(
        "relative p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg",
        selected
          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
          : "border-gray-200 bg-white hover:border-gray-300"
      )}
      onClick={onClick}
    >
      {selected && (
        <div className="absolute top-2 right-2">
          <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            Selected
          </div>
        </div>
      )}
      
      <div className="flex items-start space-x-4">
        <div className={cn(
          "p-3 rounded-lg",
          selected ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
        )}>
          <Icon className="w-6 h-6" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{name}</h3>
          <p className="text-sm text-gray-600 mb-3">{description}</p>
          
          <div className="flex flex-wrap gap-2">
            {features.map((feature) => (
              <span
                key={feature}
                className={cn(
                  "text-xs px-2 py-1 rounded",
                  selected
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                )}
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export function MultiStepForm({
  currentStep,
  totalSteps,
  children,
  onNext,
  onBack,
  isLoading,
  nextLabel = "Next",
  backLabel = "Back",
  showBack = true,
  showNext = true,
}: {
  currentStep: number;
  totalSteps: number;
  children: React.ReactNode;
  onNext: () => void;
  onBack: () => void;
  isLoading?: boolean;
  nextLabel?: string;
  backLabel?: string;
  showBack?: boolean;
  showNext?: boolean;
}) {
  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <React.Fragment key={index}>
            <Step
              number={index + 1}
              status={
                index < currentStep
                  ? "completed"
                  : index === currentStep
                  ? "current"
                  : "pending"
              }
            />
            {index < totalSteps - 1 && (
              <ProgressConnector completed={index < currentStep} />
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Content */}
      <div className="mt-8">{children}</div>
      
      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        {showBack && (
          <button
            onClick={onBack}
            disabled={currentStep === 0 || isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            {backLabel}
          </button>
        )}
        
        {showNext && (
          <button
            onClick={onNext}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Loading..." : nextLabel}
          </button>
        )}
      </div>
    </div>
  );
}