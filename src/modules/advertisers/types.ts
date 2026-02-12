export interface Advertiser {
  id: string;                    // adv_xxx
  name: string;
  merchantId?: string;           // merchant_xxx, 18 chars
  logoUrl?: string;
  websiteUrl?: string;
  businessCategories: string[];
  mccCodes: string[];
  contactEmail: string;
  contactPhone?: string;
  programId?: string;            // 22 chars
  activeCampaigns: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

