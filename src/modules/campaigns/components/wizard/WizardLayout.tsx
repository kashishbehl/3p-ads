import React from 'react';
import {
  Box,
  Button,
  Heading,
  Text,
  StepGroup,
  StepItem,
  StepItemIndicator,
  StepItemIcon,
  Divider,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  CheckCircleIcon,
} from '@razorpay/blade/components';
import { WIZARD_STEPS } from '../../hooks/useWizardState';

interface WizardLayoutProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  onBack: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
  onCancel: () => void;
  isLastStep: boolean;
  isFirstStep: boolean;
  children: React.ReactNode;
}

function WizardLayout({
  currentStep,
  onStepClick,
  onBack,
  onNext,
  onSaveDraft,
  onCancel,
  isLastStep,
  isFirstStep,
  children,
}: WizardLayoutProps) {
  return (
    <Box display="flex" flexDirection="column" minHeight="calc(100vh - 80px)">
      {/* Top Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom="spacing.5"
      >
        <Box>
          <Heading size="xlarge">Create Campaign</Heading>
          <Text size="small" color="surface.text.gray.subtle" marginTop="spacing.1">
            Step {currentStep + 1} of {WIZARD_STEPS.length}: {WIZARD_STEPS[currentStep].title}
          </Text>
        </Box>
        <Box display="flex" gap="spacing.3">
          <Button variant="tertiary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={onSaveDraft}>
            Save Draft
          </Button>
        </Box>
      </Box>

      {/* Horizontal Step Indicator */}
      <Box marginBottom="spacing.6">
        <StepGroup orientation="horizontal" size="medium" width="100%">
          {WIZARD_STEPS.map((step, index) => (
            <StepItem
              key={step.title}
              title={step.title}
              stepProgress={
                index < currentStep ? 'full' : index === currentStep ? 'start' : 'none'
              }
              marker={
                index < currentStep ? (
                  <StepItemIcon icon={CheckIcon} color="positive" />
                ) : (
                  <StepItemIndicator
                    color={index === currentStep ? 'primary' : 'neutral'}
                  />
                )
              }
              isSelected={index === currentStep}
              onClick={() => onStepClick(index)}
            />
          ))}
        </StepGroup>
      </Box>

      <Divider />

      {/* Content Area */}
      <Box flex={1} paddingY="spacing.6">
        {children}
      </Box>

      <Divider />

      {/* Footer Navigation */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        paddingY="spacing.5"
      >
        <Button
          variant="tertiary"
          icon={ArrowLeftIcon}
          onClick={onBack}
          isDisabled={isFirstStep}
        >
          Back
        </Button>
        <Box display="flex" gap="spacing.3">
          {isLastStep ? (
            <Button
              color="positive"
              icon={CheckCircleIcon}
              onClick={onNext}
            >
              Launch Campaign
            </Button>
          ) : (
            <Button
              icon={ArrowRightIcon}
              iconPosition="right"
              onClick={onNext}
            >
              Continue
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default WizardLayout;

