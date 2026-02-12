import React from 'react';
import {
  Box,
  Heading,
  Text,
  Card,
  CardBody,
  CardHeader,
  CardHeaderLeading,
  Badge,
  Alert,
} from '@razorpay/blade/components';
import { mockAds } from '../../../ads/mocks/ads.mock';
import { mockCreatives } from '../../../creatives/mocks/creatives.mock';
import type { Campaign } from '../../types';

interface CreativesTabProps {
  campaign: Campaign;
}

function CreativesTab({ campaign }: CreativesTabProps) {
  const campaignAds = mockAds.filter((a) => a.campaignId === campaign.id);

  // Group creatives by ad
  const adCreativeGroups = campaignAds.map((ad) => {
    const creatives = (ad.mappedCreativeIds ?? [])
      .map((id) => mockCreatives.find((c) => c.id === id))
      .filter(Boolean);
    return { ad, creatives };
  });

  const totalCreatives = new Set(campaignAds.flatMap((a) => a.mappedCreativeIds ?? [])).size;

  return (
    <Box paddingTop="spacing.5" display="flex" flexDirection="column" gap="spacing.5">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Heading size="medium">Creatives by Ad</Heading>
        <Badge color="neutral">{String(totalCreatives)} unique creatives</Badge>
      </Box>

      {campaignAds.length === 0 ? (
        <Alert
          color="information"
          description="No ads in this campaign yet. Add ads first, then map creatives to them."
          isDismissible={false}
        />
      ) : (
        adCreativeGroups.map(({ ad, creatives }) => (
          <Card key={ad.id}>
            <CardHeader>
              <CardHeaderLeading
                title={ad.name}
                subtitle={`${ad.type} · ${creatives.length} creatives mapped`}
                suffix={
                  <Badge
                    color={creatives.length > 0 ? 'positive' : 'negative'}
                    size="small"
                  >
                    {creatives.length > 0 ? 'Has Creatives' : 'No Creatives'}
                  </Badge>
                }
              />
            </CardHeader>
            <CardBody>
              {creatives.length === 0 ? (
                <Text size="small" color="surface.text.gray.muted">
                  No creatives mapped to this ad yet.
                </Text>
              ) : (
                <Box display="flex" gap="spacing.4" flexWrap="wrap">
                  {creatives.map((creative) =>
                    creative ? (
                      <Box
                        key={creative.id}
                        width={{ base: '100%', s: '200px' }}
                        display="flex"
                        flexDirection="column"
                        gap="spacing.2"
                      >
                        <Box
                          height="100px"
                          backgroundColor="surface.background.gray.moderate"
                          borderRadius="small"
                          overflow="hidden"
                        >
                          {creative.assets[0] && (
                            <img
                              src={creative.assets[0].url}
                              alt={creative.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          )}
                        </Box>
                        <Text size="small" weight="semibold" truncateAfterLines={1}>
                          {creative.name}
                        </Text>
                        <Box display="flex" gap="spacing.1">
                          <Badge color="primary" emphasis="subtle" size="small">
                            {creative.type}
                          </Badge>
                          <Badge color="neutral" size="small">
                            {creative.assets.length} assets
                          </Badge>
                        </Box>
                      </Box>
                    ) : null
                  )}
                </Box>
              )}
            </CardBody>
          </Card>
        ))
      )}
    </Box>
  );
}

export default CreativesTab;

