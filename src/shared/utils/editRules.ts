import type { CampaignStatus, FieldEditability } from '../constants/enums';

type CampaignField =
  | 'name'
  | 'type'
  | 'advertiserId'
  | 'description'
  | 'priority'
  | 'pricingModel'
  | 'priceValue'
  | 'totalBudget'
  | 'dailyBudget'
  | 'pacing'
  | 'startDate'
  | 'endDate'
  | 'segments'
  | 'guardrails'
  | 'addAds'
  | 'removeAds'
  | 'addCreatives'
  | 'removeCreatives';

const editabilityMatrix: Record<CampaignStatus, Record<CampaignField, FieldEditability>> = {
  DRAFT: {
    name: 'editable',
    type: 'editable',
    advertiserId: 'editable',
    description: 'editable',
    priority: 'editable',
    pricingModel: 'editable',
    priceValue: 'editable',
    totalBudget: 'editable',
    dailyBudget: 'editable',
    pacing: 'editable',
    startDate: 'editable',
    endDate: 'editable',
    segments: 'editable',
    guardrails: 'editable',
    addAds: 'editable',
    removeAds: 'editable',
    addCreatives: 'editable',
    removeCreatives: 'editable',
  },
  ACTIVE: {
    name: 'editable',
    type: 'locked',
    advertiserId: 'locked',
    description: 'editable',
    priority: 'editable',
    pricingModel: 'locked',
    priceValue: 'locked',
    totalBudget: 'increase_only',
    dailyBudget: 'editable',
    pacing: 'editable',
    startDate: 'locked',
    endDate: 'end_only',
    segments: 'editable',
    guardrails: 'editable',
    addAds: 'editable',
    removeAds: 'editable',
    addCreatives: 'editable',
    removeCreatives: 'editable',
  },
  INACTIVE: {
    name: 'editable',
    type: 'editable',
    advertiserId: 'locked',
    description: 'editable',
    priority: 'editable',
    pricingModel: 'editable',
    priceValue: 'editable',
    totalBudget: 'editable',
    dailyBudget: 'editable',
    pacing: 'editable',
    startDate: 'editable',
    endDate: 'editable',
    segments: 'editable',
    guardrails: 'editable',
    addAds: 'editable',
    removeAds: 'editable',
    addCreatives: 'editable',
    removeCreatives: 'editable',
  },
  TERMINATED: {
    name: 'locked',
    type: 'locked',
    advertiserId: 'locked',
    description: 'locked',
    priority: 'locked',
    pricingModel: 'locked',
    priceValue: 'locked',
    totalBudget: 'locked',
    dailyBudget: 'locked',
    pacing: 'locked',
    startDate: 'locked',
    endDate: 'locked',
    segments: 'locked',
    guardrails: 'locked',
    addAds: 'locked',
    removeAds: 'locked',
    addCreatives: 'locked',
    removeCreatives: 'locked',
  },
};

/**
 * Get field editability based on campaign status
 */
export const getFieldEditability = (
  status: CampaignStatus,
  field: CampaignField
): FieldEditability => {
  return editabilityMatrix[status]?.[field] ?? 'locked';
};

/**
 * Check if a field is editable (any form of editability)
 */
export const isFieldEditable = (status: CampaignStatus, field: CampaignField): boolean => {
  const editability = getFieldEditability(status, field);
  return editability !== 'locked';
};

