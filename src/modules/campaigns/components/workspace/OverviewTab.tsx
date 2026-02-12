import React from 'react';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  CardHeaderLeading,
  CardHeaderIcon,
  Text,
  Badge,
  Amount,
  Divider,
  ProgressBar,
  InfoIcon,
  SettingsIcon,
} from '@razorpay/blade/components';
import type { Campaign } from '../../types';
import { formatDate, formatCurrency } from '../../../../shared/utils/formatters';
import { useCampaignReadiness } from '../../hooks/useCampaignReadiness';

interface OverviewTabProps {
  campaign: Campaign;
}

function OverviewTab({ campaign }: OverviewTabProps) {
  const readiness = useCampaignReadiness(campaign);

  return (
    <Box paddingTop="spacing.5" display="flex" flexDirection="column" gap="spacing.5">
      {/* Readiness Bar */}
      {campaign.status === 'DRAFT' && (
        <Card>
          <CardHeader>
            <CardHeaderLeading
              title="Campaign Readiness"
              suffix={
                <Badge color={readiness.isReady ? 'positive' : 'notice'}>
                  {readiness.percentage}%
                </Badge>
              }
            />
          </CardHeader>
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.4">
              <ProgressBar
                label="Readiness"
                value={readiness.percentage}
                showPercentage
                accessibilityLabel={`Campaign readiness: ${readiness.percentage}%`}
              />
              <Box display="flex" flexDirection="column" gap="spacing.2">
                {readiness.checks.map((check) => (
                  <Box key={check.label} display="flex" justifyContent="space-between" alignItems="center">
                    <Text size="small">{check.label}</Text>
                    <Box display="flex" gap="spacing.2" alignItems="center">
                      <Text size="xsmall" color="surface.text.gray.muted">{check.description}</Text>
                      <Badge color={check.passed ? 'positive' : 'negative'} size="small">
                        {check.passed ? 'Done' : 'Pending'}
                      </Badge>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </CardBody>
        </Card>
      )}

      {/* Details Cards */}
      <Box display="flex" gap="spacing.5" flexWrap="wrap">
        <Card width={{ base: '100%' }} flex={{ base: 'initial', m: '1' }} minWidth={{ m: '320px' }}>
          <CardHeader>
            <CardHeaderLeading title="Campaign Details" prefix={<CardHeaderIcon icon={InfoIcon} />} />
          </CardHeader>
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.3">
              <Box>
                <Text size="small" color="surface.text.gray.subtle">Type</Text>
                <Badge color="primary" emphasis="subtle">{campaign.type}</Badge>
              </Box>
              <Box>
                <Text size="small" color="surface.text.gray.subtle">Priority</Text>
                <Text weight="semibold">{campaign.priority}/10</Text>
              </Box>
              {campaign.description && (
                <Box>
                  <Text size="small" color="surface.text.gray.subtle">Description</Text>
                  <Text>{campaign.description}</Text>
                </Box>
              )}
              <Box>
                <Text size="small" color="surface.text.gray.subtle">Created</Text>
                <Text>{formatDate(campaign.createdAt)}</Text>
              </Box>
            </Box>
          </CardBody>
        </Card>

        <Card width={{ base: '100%' }} flex={{ base: 'initial', m: '1' }} minWidth={{ m: '320px' }}>
          <CardHeader>
            <CardHeaderLeading title="Budget & Pricing" prefix={<CardHeaderIcon icon={SettingsIcon} />} />
          </CardHeader>
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.3">
              <Box>
                <Text size="small" color="surface.text.gray.subtle">Pricing Model</Text>
                <Box display="flex" alignItems="center" gap="spacing.2">
                  <Badge color="neutral">{campaign.pricingModel}</Badge>
                  <Text size="small">@ {formatCurrency(campaign.priceValue)}</Text>
                </Box>
              </Box>
              <Box>
                <Text size="small" color="surface.text.gray.subtle">Total Budget</Text>
                <Amount value={campaign.totalBudget / 100} type="heading" size="medium" weight="semibold" currency="INR" />
              </Box>
              <Box>
                <Text size="small" color="surface.text.gray.subtle">Daily Budget</Text>
                <Amount value={campaign.dailyBudget / 100} type="body" size="medium" currency="INR" />
              </Box>
              <Box>
                <Text size="small" color="surface.text.gray.subtle">Pacing</Text>
                <Text>{campaign.pacing}</Text>
              </Box>
            </Box>
          </CardBody>
        </Card>
      </Box>

      {/* Schedule */}
      {(campaign.startDate || campaign.endDate) && (
        <Card width="100%">
          <CardHeader>
            <CardHeaderLeading title="Schedule" />
          </CardHeader>
          <CardBody>
            <Box display="flex" gap="spacing.6">
              {campaign.startDate && (
                <Box>
                  <Text size="small" color="surface.text.gray.subtle">Start Date</Text>
                  <Text weight="semibold">{formatDate(campaign.startDate)}</Text>
                </Box>
              )}
              {campaign.endDate && (
                <Box>
                  <Text size="small" color="surface.text.gray.subtle">End Date</Text>
                  <Text weight="semibold">{formatDate(campaign.endDate)}</Text>
                </Box>
              )}
            </Box>
          </CardBody>
        </Card>
      )}
    </Box>
  );
}

export default OverviewTab;

