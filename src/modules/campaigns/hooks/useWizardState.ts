import { useState, useCallback } from 'react';
import type { Campaign } from '../types';
import type { Ad } from '../../ads/types';

export interface WizardAdEntry {
  id: string;
  name: string;
  type: 'BANNER' | 'SCRATCH_CARD';
  rewardId: string;
  status: boolean; // true = active, false = inactive
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
  segmentWhitelist: string; // comma-separated segment names
  segmentBlacklist: string; // comma-separated segment names
  publisherIds: string[]; // publisher IDs

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
  segmentWhitelist: '',
  segmentBlacklist: '',
  publisherIds: [],

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
          // Hard validation: block if daily budget exceeds total budget
          if (formData.dailyBudget && formData.totalBudget &&
              Number(formData.dailyBudget) > Number(formData.totalBudget)) {
            errors.dailyBudget = 'Daily budget cannot exceed total budget';
          }
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

  const loadCampaignData = useCallback((campaign: Campaign, ads: Ad[], mode: 'edit' | 'clone') => {
    const campaignName = mode === 'clone' ? `${campaign.name} (Copy)` : campaign.name;

    // Convert segments to comma-separated strings
    const segmentWhitelist = campaign.segments?.whitelist.join(', ') || '';
    const segmentBlacklist = campaign.segments?.blacklist.join(', ') || '';

    // Map ads to wizard format
    const wizardAds: WizardAdEntry[] = ads.map(ad => ({
      id: mode === 'clone' ? `wizard_ad_${Date.now()}_${Math.random()}` : ad.id,
      name: mode === 'clone' ? `${ad.name} (Copy)` : ad.name,
      type: ad.type,
      rewardId: ad.rewardId || '',
      status: ad.status,
      mappedCreativeIds: ad.mappedCreativeIds || [],
    }));

    setFormData({
      // Advertiser
      advertiserId: campaign.advertiserId,
      advertiserName: campaign.advertiserName,
      isNewAdvertiser: false,
      newAdvertiserName: '',
      newAdvertiserEmail: '',
      newAdvertiserMerchantId: '',
      newAdvertiserWebsite: '',
      // Campaign Details (convert paisa to rupees for UI)
      campaignName,
      campaignType: campaign.type,
      description: campaign.description || '',
      priority: String(campaign.priority),
      pricingModel: campaign.pricingModel,
      priceValue: String(campaign.priceValue), // Keep in paisa, UI will convert
      totalBudget: String(campaign.totalBudget), // Keep in paisa, UI will convert
      dailyBudget: String(campaign.dailyBudget), // Keep in paisa, UI will convert
      pacing: campaign.pacing,
      startDate: campaign.startDate || '',
      endDate: campaign.endDate || '',
      segmentWhitelist,
      segmentBlacklist,
      publisherIds: campaign.publisherIds || [],
      // Ads
      ads: wizardAds,
    });

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
    loadCampaignData,
  };
}

