import type { PricingModel, CampaignStatus, CampaignType, PacingType } from '../../shared/constants/enums';

export interface Campaign {
  id: string;                    // cmp_xxx
  name: string;
  type: CampaignType;
  advertiserId: string;
  advertiserName: string;
  description?: string;
  priority: number;              // 1-10
  currency: 'INR';
  pricingModel: PricingModel;
  priceValue: number;            // in paisa
  totalBudget: number;
  dailyBudget: number;
  pacing: PacingType;
  startDate?: string;
  endDate?: string;
  status: CampaignStatus;
  activeAds: number;
  segments?: { whitelist: string[]; blacklist: string[] };
  guardrails?: string[];
  createdAt: string;
}

