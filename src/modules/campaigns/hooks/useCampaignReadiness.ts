import { useMemo } from 'react';
import type { Campaign } from '../types';
import { mockAds } from '../../ads/mocks/ads.mock';
import { mockCreatives } from '../../creatives/mocks/creatives.mock';

export interface ReadinessCheck {
  label: string;
  passed: boolean;
  description: string;
}

export interface CampaignReadiness {
  percentage: number;
  checks: ReadinessCheck[];
  isReady: boolean;
}

export function useCampaignReadiness(campaign: Campaign | undefined): CampaignReadiness {
  return useMemo(() => {
    if (!campaign) {
      return { percentage: 0, checks: [], isReady: false };
    }

    const campaignAds = mockAds.filter((a) => a.campaignId === campaign.id);
    const adsWithCreatives = campaignAds.filter(
      (a) => a.mappedCreativeIds && a.mappedCreativeIds.length > 0
    );

    // Check that all mapped creative IDs actually exist
    const allMappedIds = campaignAds.flatMap((a) => a.mappedCreativeIds ?? []);
    const validCreativeIds = allMappedIds.filter((id) =>
      mockCreatives.some((c) => c.id === id)
    );

    const checks: ReadinessCheck[] = [
      {
        label: 'Advertiser linked',
        passed: Boolean(campaign.advertiserId),
        description: campaign.advertiserId
          ? `Linked to ${campaign.advertiserName}`
          : 'No advertiser assigned',
      },
      {
        label: 'Budget configured',
        passed: campaign.totalBudget > 0 && campaign.dailyBudget > 0,
        description:
          campaign.totalBudget > 0
            ? `₹${(campaign.totalBudget / 100).toLocaleString('en-IN')} total`
            : 'Budget not set',
      },
      {
        label: 'Schedule set',
        passed: Boolean(campaign.startDate),
        description: campaign.startDate ? `Starts ${campaign.startDate.split('T')[0]}` : 'No start date',
      },
      {
        label: 'Has ads',
        passed: campaignAds.length > 0,
        description:
          campaignAds.length > 0
            ? `${campaignAds.length} ad${campaignAds.length > 1 ? 's' : ''} created`
            : 'No ads created yet',
      },
      {
        label: 'Creatives mapped',
        passed: adsWithCreatives.length === campaignAds.length && campaignAds.length > 0,
        description:
          campaignAds.length === 0
            ? 'Create ads first'
            : `${adsWithCreatives.length}/${campaignAds.length} ads have creatives`,
      },
    ];

    const passedCount = checks.filter((c) => c.passed).length;
    const percentage = Math.round((passedCount / checks.length) * 100);

    return {
      percentage,
      checks,
      isReady: passedCount === checks.length,
    };
  }, [campaign]);
}

