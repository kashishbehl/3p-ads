// Campaign Pricing Models
export const PRICING_MODELS = ['CPC', 'CPM', 'CPA', 'ROAS', 'CPCO', 'CPL', 'CPQL'] as const;
export type PricingModel = (typeof PRICING_MODELS)[number];

// Campaign Statuses
export const CAMPAIGN_STATUSES = ['DRAFT', 'ACTIVE', 'INACTIVE', 'TERMINATED'] as const;
export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number];

// Campaign Types
export const CAMPAIGN_TYPES = ['BRANDING', 'PERFORMANCE'] as const;
export type CampaignType = (typeof CAMPAIGN_TYPES)[number];

// Pacing Types
export const PACING_TYPES = ['EVEN', 'FAST', 'CUSTOM'] as const;
export type PacingType = (typeof PACING_TYPES)[number];

// Ad Types
export const AD_TYPES = ['BANNER', 'SCRATCH_CARD'] as const;
export type AdType = (typeof AD_TYPES)[number];

// Creative Types
export const CREATIVE_TYPES = ['IMAGE', 'VIDEO', 'TEXT'] as const;
export type CreativeType = (typeof CREATIVE_TYPES)[number];

// Aspect Ratios
export const ASPECT_RATIOS = ['1:1', '9:16', '16:9', '1.91:1', '1:1.91'] as const;
export type AspectRatio = (typeof ASPECT_RATIOS)[number];

// Advertiser Statuses
export const ADVERTISER_STATUSES = ['ACTIVE', 'INACTIVE'] as const;
export type AdvertiserStatus = (typeof ADVERTISER_STATUSES)[number];

// Status color map for badges
export const STATUS_COLORS: Record<string, 'information' | 'positive' | 'notice' | 'negative' | 'neutral'> = {
  DRAFT: 'information',
  ACTIVE: 'positive',
  INACTIVE: 'notice',
  TERMINATED: 'negative',
};

// Field Editability
export type FieldEditability = 'editable' | 'locked' | 'increase_only' | 'end_only';

