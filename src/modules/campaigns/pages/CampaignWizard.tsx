import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@razorpay/blade/components';
import { useWizardState, WIZARD_STEPS } from '../hooks/useWizardState';
import WizardLayout from '../components/wizard/WizardLayout';
import StepAdvertiser from '../components/wizard/StepAdvertiser';
import StepCampaignDetails from '../components/wizard/StepCampaignDetails';
import StepAddAds from '../components/wizard/StepAddAds';
import StepAttachCreatives from '../components/wizard/StepAttachCreatives';
import StepReviewLaunch from '../components/wizard/StepReviewLaunch';

function CampaignWizard() {
  const navigate = useNavigate();
  const toast = useToast();
  const wizard = useWizardState();

  const handleCancel = () => {
    navigate('/admin/campaigns');
  };

  const handleSaveDraft = () => {
    if (!wizard.formData.campaignName.trim()) {
      toast.show({
        content: 'Enter a campaign name to save as draft',
        color: 'notice',
        autoDismiss: true,
      });
      return;
    }
    toast.show({
      content: `Campaign "${wizard.formData.campaignName}" saved as draft`,
      color: 'information',
      autoDismiss: true,
    });
    navigate('/admin/campaigns');
  };

  const handleNext = () => {
    if (wizard.currentStep === WIZARD_STEPS.length - 1) {
      // Last step: launch
      const validation = wizard.validateStep(4);
      if (!validation.isValid) {
        toast.show({
          content: 'Please fix all validation errors before launching',
          color: 'negative',
          autoDismiss: true,
        });
        return;
      }
      toast.show({
        content: `Campaign "${wizard.formData.campaignName}" launched successfully!`,
        color: 'positive',
        autoDismiss: true,
      });
      navigate('/admin/campaigns');
    } else {
      wizard.goNext();
    }
  };

  const handleStepClick = (step: number) => {
    // Allow clicking to previously visited steps or current step
    if (step <= wizard.currentStep) {
      wizard.goTo(step);
    }
  };

  const renderStep = () => {
    switch (wizard.currentStep) {
      case 0:
        return (
          <StepAdvertiser
            formData={wizard.formData}
            errors={wizard.stepErrors}
            updateField={wizard.updateField}
          />
        );
      case 1:
        return (
          <StepCampaignDetails
            formData={wizard.formData}
            errors={wizard.stepErrors}
            updateField={wizard.updateField}
          />
        );
      case 2:
        return (
          <StepAddAds
            formData={wizard.formData}
            errors={wizard.stepErrors}
            updateAds={wizard.updateAds}
          />
        );
      case 3:
        return (
          <StepAttachCreatives
            formData={wizard.formData}
            updateAds={wizard.updateAds}
          />
        );
      case 4:
        return (
          <StepReviewLaunch
            formData={wizard.formData}
            onEditStep={wizard.goTo}
          />
        );
      default:
        return null;
    }
  };

  return (
    <WizardLayout
      currentStep={wizard.currentStep}
      onStepClick={handleStepClick}
      onBack={wizard.goBack}
      onNext={handleNext}
      onSaveDraft={handleSaveDraft}
      onCancel={handleCancel}
      isLastStep={wizard.currentStep === WIZARD_STEPS.length - 1}
      isFirstStep={wizard.currentStep === 0}
    >
      {renderStep()}
    </WizardLayout>
  );
}

export default CampaignWizard;

