import React from 'react';
import {
  Box,
  Heading,
  Text,
  Card,
  CardBody,
  CardHeader,
  CardHeaderLeading,
  CardHeaderIcon,
  Badge,
  Button,
  Divider,
  Alert,
  Amount,
  Link,
  InfoIcon,
  SettingsIcon,
  UserIcon,
  EditIcon,
  CheckCircleIcon,
  CloseIcon,
} from '@razorpay/blade/components';
import { mockAdvertisers } from '../../../advertisers/mocks/advertisers.mock';
import { mockCreatives } from '../../../creatives/mocks/creatives.mock';
import { formatCurrency } from '../../../../shared/utils/formatters';
import type { WizardFormData } from '../../hooks/useWizardState';

interface StepReviewLaunchProps {
  formData: WizardFormData;
  onEditStep: (step: number) => void;
}

function StepReviewLaunch({ formData, onEditStep }: StepReviewLaunchProps) {
  const advertiser = formData.isNewAdvertiser
    ? { name: formData.newAdvertiserName, contactEmail: formData.newAdvertiserEmail }
    : mockAdvertisers.find((a) => a.id === formData.advertiserId);

  const allAdsHaveCreatives = formData.ads.every((ad) => ad.mappedCreativeIds.length > 0);
  const hasAds = formData.ads.length > 0;
  const hasAdvertiser = formData.isNewAdvertiser
    ? Boolean(formData.newAdvertiserName)
    : Boolean(formData.advertiserId);
  const hasCampaignName = Boolean(formData.campaignName.trim());
  const hasBudget =
    Boolean(formData.totalBudget) && Boolean(formData.dailyBudget) && Boolean(formData.priceValue);

  const readyToLaunch = hasAdvertiser && hasCampaignName && hasBudget && hasAds;

  const checks = [
    { label: 'Advertiser selected', passed: hasAdvertiser },
    { label: 'Campaign name set', passed: hasCampaignName },
    { label: 'Budget configured', passed: hasBudget },
    { label: 'At least one ad created', passed: hasAds },
    { label: 'All ads have creatives', passed: allAdsHaveCreatives },
  ];

  return (
    <Box display="flex" justifyContent="center">
      <Box width="100%" maxWidth="700px" display="flex" flexDirection="column" gap="spacing.6">
        <Box>
          <Heading size="large">Review & Launch</Heading>
          <Text size="small" color="surface.text.gray.subtle" marginTop="spacing.2">
            Review your campaign configuration before launching.
          </Text>
        </Box>

        {/* Readiness Checklist */}
        <Card>
          <CardHeader>
            <CardHeaderLeading
              title="Launch Checklist"
              suffix={
                <Badge color={readyToLaunch ? 'positive' : 'notice'}>
                  {readyToLaunch ? 'Ready' : 'Incomplete'}
                </Badge>
              }
            />
          </CardHeader>
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.3">
              {checks.map((check) => (
                <Box key={check.label} display="flex" alignItems="center" gap="spacing.3">
                  {check.passed ? (
                    <CheckCircleIcon size="small" color="feedback.icon.positive.intense" />
                  ) : (
                    <CloseIcon size="small" color="feedback.icon.negative.intense" />
                  )}
                  <Text
                    size="small"
                    color={
                      check.passed
                        ? 'surface.text.gray.normal'
                        : 'feedback.text.negative.intense'
                    }
                  >
                    {check.label}
                  </Text>
                </Box>
              ))}
            </Box>
          </CardBody>
        </Card>

        {!readyToLaunch && (
          <Alert
            color="notice"
            title="Campaign not ready"
            description="Complete all required fields before launching. You can save as a draft and come back later."
            isDismissible={false}
          />
        )}

        {/* Advertiser Summary */}
        <Card>
          <CardHeader>
            <CardHeaderLeading
              title="Advertiser"
              prefix={<CardHeaderIcon icon={UserIcon} />}
              suffix={
                <Button
                  variant="tertiary"
                  size="small"
                  icon={EditIcon}
                  onClick={() => onEditStep(0)}
                >
                  Edit
                </Button>
              }
            />
          </CardHeader>
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.2">
              <Box display="flex" justifyContent="space-between">
                <Text size="small" color="surface.text.gray.subtle">Name</Text>
                <Text size="small" weight="semibold">{advertiser?.name || '—'}</Text>
              </Box>
              {formData.isNewAdvertiser && (
                <>
                  <Box display="flex" justifyContent="space-between">
                    <Text size="small" color="surface.text.gray.subtle">Email</Text>
                    <Text size="small">{formData.newAdvertiserEmail || '—'}</Text>
                  </Box>
                  <Badge color="information" size="small">New Advertiser</Badge>
                </>
              )}
            </Box>
          </CardBody>
        </Card>

        {/* Campaign Summary */}
        <Card>
          <CardHeader>
            <CardHeaderLeading
              title="Campaign Details"
              prefix={<CardHeaderIcon icon={InfoIcon} />}
              suffix={
                <Button
                  variant="tertiary"
                  size="small"
                  icon={EditIcon}
                  onClick={() => onEditStep(1)}
                >
                  Edit
                </Button>
              }
            />
          </CardHeader>
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.3">
              <Box display="flex" justifyContent="space-between">
                <Text size="small" color="surface.text.gray.subtle">Name</Text>
                <Text size="small" weight="semibold">{formData.campaignName || '—'}</Text>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Text size="small" color="surface.text.gray.subtle">Type</Text>
                <Badge color="primary" emphasis="subtle" size="small">{formData.campaignType}</Badge>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Text size="small" color="surface.text.gray.subtle">Pricing</Text>
                <Text size="small">
                  {formData.pricingModel} @ {formData.priceValue ? formatCurrency(Number(formData.priceValue)) : '—'}
                </Text>
              </Box>
              <Divider />
              <Box display="flex" justifyContent="space-between">
                <Text size="small" color="surface.text.gray.subtle">Total Budget</Text>
                {formData.totalBudget ? (
                  <Amount value={Number(formData.totalBudget) / 100} type="body" size="small" currency="INR" />
                ) : (
                  <Text size="small">—</Text>
                )}
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Text size="small" color="surface.text.gray.subtle">Daily Budget</Text>
                {formData.dailyBudget ? (
                  <Amount value={Number(formData.dailyBudget) / 100} type="body" size="small" currency="INR" />
                ) : (
                  <Text size="small">—</Text>
                )}
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Text size="small" color="surface.text.gray.subtle">Pacing</Text>
                <Text size="small">{formData.pacing}</Text>
              </Box>
              {formData.startDate && (
                <Box display="flex" justifyContent="space-between">
                  <Text size="small" color="surface.text.gray.subtle">Schedule</Text>
                  <Text size="small">
                    {formData.startDate} → {formData.endDate || 'No end date'}
                  </Text>
                </Box>
              )}
            </Box>
          </CardBody>
        </Card>

        {/* Ads Summary */}
        <Card>
          <CardHeader>
            <CardHeaderLeading
              title={`Ads (${formData.ads.length})`}
              prefix={<CardHeaderIcon icon={SettingsIcon} />}
              suffix={
                <Button
                  variant="tertiary"
                  size="small"
                  icon={EditIcon}
                  onClick={() => onEditStep(2)}
                >
                  Edit
                </Button>
              }
            />
          </CardHeader>
          <CardBody>
            {formData.ads.length === 0 ? (
              <Text size="small" color="surface.text.gray.muted">No ads created</Text>
            ) : (
              <Box display="flex" flexDirection="column" gap="spacing.3">
                {formData.ads.map((ad, index) => {
                  const creativeNames = ad.mappedCreativeIds
                    .map((id) => mockCreatives.find((c) => c.id === id)?.name)
                    .filter(Boolean);

                  return (
                    <Box key={ad.id}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Text size="small" weight="semibold">
                            {ad.name || `Ad ${index + 1}`}
                          </Text>
                          <Text size="xsmall" color="surface.text.gray.muted">
                            {ad.type}{ad.rewardId ? ` · Reward: ${ad.rewardId}` : ''}
                          </Text>
                        </Box>
                        <Badge
                          color={ad.mappedCreativeIds.length > 0 ? 'positive' : 'negative'}
                          size="small"
                        >
                          {ad.mappedCreativeIds.length} creatives
                        </Badge>
                      </Box>
                      {creativeNames.length > 0 && (
                        <Text size="xsmall" color="surface.text.gray.subtle" marginTop="spacing.1">
                          {creativeNames.join(', ')}
                        </Text>
                      )}
                      {index < formData.ads.length - 1 && <Divider marginY="spacing.3" />}
                    </Box>
                  );
                })}
              </Box>
            )}
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
}

export default StepReviewLaunch;

