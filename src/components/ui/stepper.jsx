import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
export function StepperHeader({ children }) {
  return <>{children}</>;
}
export function StepperFooter({ children }) {
  return <>{children}</>;
}
export function StepperExample({
  steps,
  handleNextStep,
  handlePreviousStep,
  className,
  children,
}) {
  const [currentStep, setCurrentStep] = useState(0);
  //Chạy handleNext để sang step mới, handleNextStep để register
  const handleNext = async () => {
    try {
      if (handleNextStep) {
        handleNextStep.forEach(async (fn, idx) => {
          if (currentStep === idx) {
            const result = await fn();
            if (result) {
              setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
            }
          }
        });
      }
    } catch (error) {
      // console.error("Validation failed, staying on current step.");
      console.log(error);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };
  const childrenByType = React.Children.toArray(children).reduce(
    (acc, child) => {
      if (React.isValidElement(child)) {
        switch (child.type) {
          case StepperHeader:
            acc.header = <>{child}</>;
            break;
          case StepperFooter:
            acc.footer = <>{child}</>;
            break;

          default:
            break;
        }
        return acc;
      }
    },
    { header: null, footer: null }
  );
  return (
    <div
      className={`w-full max-w-xs sm:max-w-2xl md:max-w-4xl bg-card rounded-lg shadow-lg p-4 sm:p-6 md:p-8 transition duration-100 ${className}`}
    >
      {/* Header */}
      {childrenByType.header}
      <div className="flex flex-col items-center gap-2 text-center mb-8">
        <h1 className="text-2xl font-bold">Register Housekeeper account</h1>
      </div>
      <Stepper steps={steps} currentStep={currentStep} />
      <div>
        {steps.map((step, idx) => {
          return <div key={idx}>{idx == currentStep && step.stepItem}</div>;
        })}
      </div>
      <div className="mt-8 sm:mt-10 md:mt-12 flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
        <Button
          type="submit"
          onClick={handlePrev}
          disabled={currentStep === 0}
          variant="outline"
          className="w-full sm:w-auto"
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          className="w-full sm:w-auto"
        >
          {currentStep === steps.length - 1 ? "Back to Home" : "Next"}
        </Button>
      </div>
      {/* Footer */}
      {childrenByType.footer}
    </div>
  );
}

export const Step = ({ label, description, icon, stepNumber, status }) => {
  const getStepClassName = () => {
    switch (status) {
      case "completed":
        return "border-primary bg-primary text-primary-foreground";
      case "current":
        return "border-primary bg-background text-primary";
      default:
        return "border-muted-foreground bg-background text-muted-foreground";
    }
  };

  return (
    <div className="relative flex flex-col items-center group">
      <div
        className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border-2 ${getStepClassName()} transition-colors duration-200`}
      >
        {status === "completed" ? (
          <CheckIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        ) : (
          <span className="text-xs sm:text-sm md:text-base font-semibold">
            {stepNumber}
          </span>
        )}
      </div>
      <div className="mt-2 md:mt-3 text-center">
        <span
          className={`text-xs sm:text-sm md:text-base font-medium ${
            status === "completed" || status === "current"
              ? "text-foreground"
              : "text-muted-foreground"
          }`}
        >
          {label}
        </span>
        {description && (
          <p className="hidden sm:block text-xs text-muted-foreground mt-0.5">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export const Stepper = ({ steps, currentStep }) => {
  return (
    <nav
      aria-label="Progress"
      className="w-full max-w-xs sm:max-w-2xl md:max-w-3xl mx-auto"
    >
      <ol className="flex items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.label}>
            {index > 0 && (
              <li className="flex-1 mx-1 sm:mx-2 mb-8 md:mb-12">
                <div className="h-0.5 w-full bg-muted-foreground/30">
                  <div
                    className="h-0.5 bg-primary transition-all duration-500 ease-in-out"
                    style={{
                      width: `${index < currentStep ? "100%" : "0%"}`,
                    }}
                  ></div>
                </div>
              </li>
            )}
            <li className={index > 0 ? "flex-1" : ""}>
              <Step
                {...step}
                stepNumber={index + 1}
                status={
                  index < currentStep
                    ? "completed"
                    : index === currentStep
                    ? "current"
                    : "upcoming"
                }
              />
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};
