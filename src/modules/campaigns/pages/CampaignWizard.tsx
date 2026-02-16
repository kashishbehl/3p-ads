import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@razorpay/blade/components';
import { useWizardState, WIZARD_STEPS } from '../hooks/useWizardState';
import { mockCampaigns } from '../mocks/campaigns.mock';
import { mockAds } from '../../ads/mocks/ads.mock';
import WizardLayout from '../components/wizard/WizardLayout';
import StepAdvertiser from '../components/wizard/StepAdvertiser';
import StepCampaignDetails from '../components/wizard/StepCampaignDetails';
import StepAddAds from '../components/wizard/StepAddAds';
import StepAttachCreatives from '../components/wizard/StepAttachCreatives';
import StepReviewLaunch from '../components/wizard/StepReviewLaunch';

interface CampaignWizardProps {
  mode?: 'create' | 'edit' | 'clone';
}

function CampaignWizard({ mode = 'create' }: CampaignWizardProps) {
  const navigate = useNavigate();
  const toast = useToast();
  const { id } = useParams<{ id: string }>();
  const wizard = useWizardState();

  // Load campaign data for edit/clone modes
  useEffect(() => {
    if ((mode === 'edit' || mode === 'clone') && id) {
      const campaign = mockCampaigns.find((c) => c.id === id);
      if (!campaign) {
        toast.show({
          content: 'Campaign not found',
          color: 'negative',
          autoDismiss: true,
        });
        navigate('/admin/campaigns');
        return;
      }

      const campaignAds = mockAds.filter((ad) => ad.campaignId === id);
      wizard.loadCampaignData(campaign, campaignAds, mode);
    }
  }, [mode, id]);

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
      // Last step: launch or update
      const validation = wizard.validateStep(4);
      if (!validation.isValid) {
        toast.show({
          content: mode === 'edit' ? 'Please fix all validation errors before updating' : 'Please fix all validation errors before launching',
          color: 'negative',
          autoDismiss: true,
        });
        return;
      }

      const actionText = mode === 'edit' ? 'updated' : mode === 'clone' ? 'cloned and launched' : 'launched';
      toast.show({
        content: `Campaign "${wizard.formData.campaignName}" ${actionText} successfully!`,
        color: 'positive',
        autoDismiss: true,
      });
      navigate('/admin/campaigns');
    } else {
      wizard.goNext();
    }
  };

  const getPageTitle = () => {
    switch (mode) {
      case 'edit':
        return 'Edit Campaign';
      case 'clone':
        return 'Clone Campaign';
      default:
        return 'Create Campaign';
    }
  };

  const getSubmitButtonText = () => {
    switch (mode) {
      case 'edit':
        return 'Update Campaign';
      case 'clone':
        return 'Launch Cloned Campaign';
      default:
        return 'Launch Campaign';
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

