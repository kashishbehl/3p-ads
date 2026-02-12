import type { CreativeType, AspectRatio } from '../../shared/constants/enums';

export interface CreativeAsset {
  aspectRatio: AspectRatio;
  url: string;
  fileType: string;
}

export interface Creative {
  id: string;                    // cre_xxx
  name: string;
  advertiserId: string;
  advertiserName: string;
  type: CreativeType;
  assets: CreativeAsset[];
  titles: { small: string; medium: string; large: string };
  subtitles: { small: string; medium: string; large: string };
  bodyText?: string;
  ctaText: string;               // max 25 chars
  ctaUrl: string;
  usedInAds: number;
  createdAt: string;
}

