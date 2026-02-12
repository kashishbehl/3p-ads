import type { AdType } from '../../shared/constants/enums';

export interface Ad {
  id: string;                    // ad_xxx
  name: string;
  campaignId: string;
  campaignName: string;
  advertiserId: string;
  advertiserName: string;
  type: AdType;
  rewardId?: string;             // 21 chars, only for SCRATCH_CARD
  status: boolean;
  creativesMapped: number;
  mappedCreativeIds: string[];
  createdAt: string;
}

