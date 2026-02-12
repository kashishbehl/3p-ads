import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Card,
  CardBody,
  CardHeader,
  CardHeaderLeading,
  Badge,
  Button,
  Checkbox,
  Alert,
  SearchInput,
  Divider,
} from '@razorpay/blade/components';
import { mockCreatives } from '../../../creatives/mocks/creatives.mock';
import type { WizardFormData, WizardAdEntry } from '../../hooks/useWizardState';

interface StepAttachCreativesProps {
  formData: WizardFormData;
  updateAds: (ads: WizardAdEntry[]) => void;
}

function StepAttachCreatives({ formData, updateAds }: StepAttachCreativesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAdIndex, setActiveAdIndex] = useState(0);

  // Get creatives for the selected advertiser
  const advertiserId = formData.isNewAdvertiser ? '' : formData.advertiserId;
  const availableCreatives = mockCreatives.filter(
    (c) =>
      (!advertiserId || c.advertiserId === advertiserId) &&
      (!searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.type.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const currentAd = formData.ads[activeAdIndex];

  const handleToggleCreative = (creativeId: string) => {
    if (!currentAd) return;
    const currentIds = currentAd.mappedCreativeIds;
    const newIds = currentIds.includes(creativeId)
      ? currentIds.filter((id) => id !== creativeId)
      : [...currentIds, creativeId];

    const updatedAds = formData.ads.map((ad, i) =>
      i === activeAdIndex ? { ...ad, mappedCreativeIds: newIds } : ad
    );
    updateAds(updatedAds);
  };

  if (formData.ads.length === 0) {
    return (
      <Box display="flex" justifyContent="center">
        <Box width="100%" maxWidth="640px">
          <Alert
            color="notice"
            title="No Ads Created"
            description="Go back to Step 3 and add at least one ad before attaching creatives."
            isDismissible={false}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center">
      <Box width="100%" maxWidth="800px" display="flex" flexDirection="column" gap="spacing.6">
        <Box>
          <Heading size="large">Attach Creatives</Heading>
          <Text size="small" color="surface.text.gray.subtle" marginTop="spacing.2">
            Select creatives for each ad. Creatives are shown for the advertiser selected in Step 1.
          </Text>
        </Box>

        {/* Ad Selector Tabs */}
        <Box display="flex" gap="spacing.3" flexWrap="wrap">
          {formData.ads.map((ad, index) => (
            <Button
              key={ad.id}
              variant={index === activeAdIndex ? 'primary' : 'tertiary'}
              size="small"
              onClick={() => setActiveAdIndex(index)}
            >
              {ad.name || `Ad ${index + 1}`}
              {ad.mappedCreativeIds.length > 0 && (
                <> ({ad.mappedCreativeIds.length})</>
              )}
            </Button>
          ))}
        </Box>

        <Divider />

        {/* Current Ad Info */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Text weight="semibold">{currentAd?.name || `Ad ${activeAdIndex + 1}`}</Text>
            <Text size="xsmall" color="surface.text.gray.muted">
              {currentAd?.mappedCreativeIds.length || 0} creatives selected
            </Text>
          </Box>
          <Badge
            color={currentAd?.mappedCreativeIds.length ? 'positive' : 'neutral'}
            size="small"
          >
            {currentAd?.mappedCreativeIds.length
              ? `${currentAd.mappedCreativeIds.length} mapped`
              : 'None mapped'}
          </Badge>
        </Box>

        {/* Search */}
        <SearchInput
          label="Search Creatives"
          placeholder="Search by name or type..."
          value={searchQuery}
          onChange={({ value }) => setSearchQuery(value ?? '')}
          onClearButtonClick={() => setSearchQuery('')}
        />

        {/* Creative Grid */}
        {availableCreatives.length === 0 ? (
          <Alert
            color="information"
            description={
              advertiserId
                ? 'No creatives found for this advertiser. You can create creatives later from the Library.'
                : 'Select an advertiser first to see available creatives.'
            }
            isDismissible={false}
          />
        ) : (
          <Box display="flex" gap="spacing.4" flexWrap="wrap">
            {availableCreatives.map((creative) => {
              const isSelected = currentAd?.mappedCreativeIds.includes(creative.id) ?? false;
              return (
                <Card
                  key={creative.id}
                  width={{ base: '100%', s: '220px' }}
                  onClick={() => handleToggleCreative(creative.id)}
                  backgroundColor={
                    isSelected ? 'surface.background.primary.subtle' : undefined
                  }
                >
                  <CardBody>
                    <Box display="flex" alignItems="center" gap="spacing.2" marginBottom="spacing.3">
                      <Checkbox
                        isChecked={isSelected}
                        onChange={() => handleToggleCreative(creative.id)}
                      >
                        {''}
                      </Checkbox>
                      <Text weight="semibold" size="small" truncateAfterLines={1}>
                        {creative.name}
                      </Text>
                    </Box>
                    <Box
                      height="100px"
                      backgroundColor="surface.background.gray.moderate"
                      borderRadius="small"
                      overflow="hidden"
                      marginBottom="spacing.3"
                    >
                      {creative.assets[0] && (
                        <img
                          src={creative.assets[0].url}
                          alt={creative.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      )}
                    </Box>
                    <Box display="flex" gap="spacing.2" marginBottom="spacing.2">
                      <Badge color="primary" emphasis="subtle" size="small">
                        {creative.type}
                      </Badge>
                      <Badge color="neutral" size="small">
                        {creative.assets.length} assets
                      </Badge>
                    </Box>
                    <Text size="xsmall" color="surface.text.gray.subtle">
                      CTA: {creative.ctaText}
                    </Text>
                  </CardBody>
                </Card>
              );
            })}
          </Box>
        )}

        {/* Summary */}
        <Card padding="spacing.4">
          <CardBody>
            <Heading size="small" marginBottom="spacing.3">
              Creative Mapping Summary
            </Heading>
            <Box display="flex" flexDirection="column" gap="spacing.2">
              {formData.ads.map((ad, index) => (
                <Box key={ad.id} display="flex" justifyContent="space-between" alignItems="center">
                  <Text size="small">{ad.name || `Ad ${index + 1}`}</Text>
                  <Badge
                    color={ad.mappedCreativeIds.length > 0 ? 'positive' : 'negative'}
                    size="small"
                  >
                    {ad.mappedCreativeIds.length} creatives
                  </Badge>
                </Box>
              ))}
            </Box>
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
}

export default StepAttachCreatives;

