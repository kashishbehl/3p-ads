import { useState, useCallback } from 'react';

export interface WizardAdEntry {
  id: string;
  name: string;
  type: 'BANNER' | 'SCRATCH_CARD';
  rewardId: string;
  mappedCreativeIds: string[];
}

export interface WizardFormData {
  // Step 1: Advertiser
  advertiserId: string;
  advertiserName: string;
  isNewAdvertiser: boolean;
  newAdvertiserName: string;
  newAdvertiserEmail: string;
  newAdvertiserMerchantId: string;
  newAdvertiserWebsite: string;

  // Step 2: Campaign Details
  campaignName: string;
  campaignType: string;
  description: string;
  priority: string;
  pricingModel: string;
  priceValue: string;
  totalBudget: string;
  dailyBudget: string;
  pacing: string;
  startDate: string;
  endDate: string;

  // Step 3: Ads
  ads: WizardAdEntry[];
}

export interface StepValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

const INITIAL_FORM_DATA: WizardFormData = {
  advertiserId: '',
  advertiserName: '',
  isNewAdvertiser: false,
  newAdvertiserName: '',
  newAdvertiserEmail: '',
  newAdvertiserMerchantId: '',
  newAdvertiserWebsite: '',

  campaignName: '',
  campaignType: 'PERFORMANCE',
  description: '',
  priority: '5',
  pricingModel: 'CPC',
  priceValue: '',
  totalBudget: '',
  dailyBudget: '',
  pacing: 'EVEN',
  startDate: '',
  endDate: '',

  ads: [],
};

export const WIZARD_STEPS = [
  { title: 'Advertiser', description: 'Select or create an advertiser' },
  { title: 'Campaign Details', description: 'Budget, pricing & schedule' },
  { title: 'Add Ads', description: 'Create ads for this campaign' },
  { title: 'Attach Creatives', description: 'Map creatives to each ad' },
  { title: 'Review & Launch', description: 'Verify and launch campaign' },
] as const;

export function useWizardState() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<WizardFormData>(INITIAL_FORM_DATA);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});

  const updateField = useCallback(
    <K extends keyof WizardFormData>(field: K, value: WizardFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setStepErrors((prev) => {
        const next = { ...prev };
        delete next[field as string];
        return next;
      });
    },
    []
  );

  const updateAds = useCallback((ads: WizardAdEntry[]) => {
    setFormData((prev) => ({ ...prev, ads }));
  }, []);

  const validateStep = useCallback(
    (step: number): StepValidation => {
      const errors: Record<string, string> = {};

      switch (step) {
        case 0: // Advertiser
          if (formData.isNewAdvertiser) {
            if (!formData.newAdvertiserName.trim()) errors.newAdvertiserName = 'Name is required';
            if (!formData.newAdvertiserEmail.trim()) errors.newAdvertiserEmail = 'Email is required';
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.newAdvertiserEmail))
              errors.newAdvertiserEmail = 'Invalid email format';
          } else {
            if (!formData.advertiserId) errors.advertiserId = 'Please select an advertiser';
          }
          break;

        case 1: // Campaign Details
          if (!formData.campaignName.trim()) errors.campaignName = 'Campaign name is required';
          if (!formData.priceValue || isNaN(Number(formData.priceValue)))
            errors.priceValue = 'Valid price is required';
          if (!formData.totalBudget || isNaN(Number(formData.totalBudget)))
            errors.totalBudget = 'Valid total budget is required';
          if (!formData.dailyBudget || isNaN(Number(formData.dailyBudget)))
            errors.dailyBudget = 'Valid daily budget is required';
          break;

        case 2: // Ads
          if (formData.ads.length === 0) errors.ads = 'Add at least one ad';
          formData.ads.forEach((ad, i) => {
            if (!ad.name.trim()) errors[`ad_${i}_name`] = `Ad ${i + 1}: name is required`;
            if (ad.type === 'SCRATCH_CARD' && !ad.rewardId.trim())
              errors[`ad_${i}_rewardId`] = `Ad ${i + 1}: Reward ID required for scratch cards`;
          });
          break;

        case 3: // Creatives - optional
          break;

        case 4: {
          // Review – run all validations
          const s0 = validateStep(0);
          const s1 = validateStep(1);
          const s2 = validateStep(2);
          return {
            isValid: s0.isValid && s1.isValid && s2.isValid,
            errors: { ...s0.errors, ...s1.errors, ...s2.errors },
          };
        }
      }

      setStepErrors(errors);
      return { isValid: Object.keys(errors).length === 0, errors };
    },
    [formData]
  );

  const goNext = useCallback(() => {
    const validation = validateStep(currentStep);
    if (validation.isValid && currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
      return true;
    }
    return false;
  }, [currentStep, validateStep]);

  const goBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setStepErrors({});
    }
  }, [currentStep]);

  const goTo = useCallback((step: number) => {
    if (step >= 0 && step < WIZARD_STEPS.length) {
      setCurrentStep(step);
      setStepErrors({});
    }
  }, []);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setFormData(INITIAL_FORM_DATA);
    setStepErrors({});
  }, []);

  return {
    currentStep,
    formData,
    stepErrors,
    updateField,
    updateAds,
    validateStep,
    goNext,
    goBack,
    goTo,
    reset,
  };
}

