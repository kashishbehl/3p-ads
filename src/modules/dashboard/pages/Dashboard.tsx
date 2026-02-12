import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  Amount,
  Link,
  PlusIcon,
  AnnouncementIcon,
  UsersIcon,
  ImageIcon,
  ArrowRightIcon,
} from '@razorpay/blade/components';
import { mockCampaigns } from '../../campaigns/mocks/campaigns.mock';
import { mockAdvertisers } from '../../advertisers/mocks/advertisers.mock';
import { mockCreatives } from '../../creatives/mocks/creatives.mock';
import { mockAds } from '../../ads/mocks/ads.mock';
import { STATUS_COLORS } from '../../../shared/constants/enums';
import { formatDate } from '../../../shared/utils/formatters';

function Dashboard() {
  const navigate = useNavigate();

  const activeCampaigns = mockCampaigns.filter((c) => c.status === 'ACTIVE');
  const draftCampaigns = mockCampaigns.filter((c) => c.status === 'DRAFT');
  const totalBudget = mockCampaigns.reduce((sum, c) => sum + c.totalBudget, 0);
  const activeAdvertisers = mockAdvertisers.filter((a) => a.status === 'ACTIVE');
  const totalAds = mockAds.length;
  const activeAds = mockAds.filter((a) => a.status).length;

  const recentCampaigns = [...mockCampaigns]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="spacing.6">
        <Box>
          <Heading size="xlarge">Dashboard</Heading>
          <Text size="small" color="surface.text.gray.subtle" marginTop="spacing.2">
            Overview of your 3P Ad Network
          </Text>
        </Box>
        <Button icon={PlusIcon} onClick={() => navigate('/admin/campaigns/create')}>
          New Campaign
        </Button>
      </Box>

      {/* Stats Cards */}
      <Box display="flex" gap="spacing.4" marginBottom="spacing.6" flexWrap="wrap">
        <Card padding="spacing.5" width={{ base: '100%', s: '48%', l: 'auto' }} flex={{ l: '1' }}>
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.2">
              <Text size="small" color="surface.text.gray.subtle">Active Campaigns</Text>
              <Heading size="2xlarge" color="feedback.text.positive.intense">
                {String(activeCampaigns.length)}
              </Heading>
              <Text size="xsmall" color="surface.text.gray.muted">
                {draftCampaigns.length} drafts pending
              </Text>
            </Box>
          </CardBody>
        </Card>

        <Card padding="spacing.5" width={{ base: '100%', s: '48%', l: 'auto' }} flex={{ l: '1' }}>
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.2">
              <Text size="small" color="surface.text.gray.subtle">Total Budget</Text>
              <Amount
                value={totalBudget / 100}
                type="heading"
                size="large"
                weight="semibold"
                currency="INR"
                suffix="humanize"
              />
              <Text size="xsmall" color="surface.text.gray.muted">
                Across {mockCampaigns.length} campaigns
              </Text>
            </Box>
          </CardBody>
        </Card>

        <Card padding="spacing.5" width={{ base: '100%', s: '48%', l: 'auto' }} flex={{ l: '1' }}>
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.2">
              <Text size="small" color="surface.text.gray.subtle">Advertisers</Text>
              <Heading size="2xlarge">{String(activeAdvertisers.length)}</Heading>
              <Text size="xsmall" color="surface.text.gray.muted">
                {mockAdvertisers.length} total registered
              </Text>
            </Box>
          </CardBody>
        </Card>

        <Card padding="spacing.5" width={{ base: '100%', s: '48%', l: 'auto' }} flex={{ l: '1' }}>
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.2">
              <Text size="small" color="surface.text.gray.subtle">Active Ads</Text>
              <Heading size="2xlarge" color="feedback.text.information.intense">
                {String(activeAds)}
              </Heading>
              <Text size="xsmall" color="surface.text.gray.muted">
                {totalAds} total across all campaigns
              </Text>
            </Box>
          </CardBody>
        </Card>
      </Box>

      {/* Content Row */}
      <Box display="flex" gap="spacing.5" flexWrap="wrap">
        {/* Recent Campaigns */}
        <Card flex={1} minWidth="360px">
          <CardHeader>
            <CardHeaderLeading
              title="Recent Campaigns"
              subtitle="Latest campaign activity"
              prefix={<CardHeaderIcon icon={AnnouncementIcon} />}
            />
          </CardHeader>
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.4">
              {recentCampaigns.map((campaign) => (
                <Box
                  key={campaign.id}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  gap="spacing.3"
                >
                  <Box flex={1} minWidth="0px">
                    <Link
                      variant="button"
                      size="small"
                      onClick={() => navigate(`/admin/campaigns/${campaign.id}`)}
                    >
                      {campaign.name}
                    </Link>
                    <Text size="xsmall" color="surface.text.gray.muted">
                      {campaign.advertiserName} · {formatDate(campaign.createdAt)}
                    </Text>
                  </Box>
                  <Badge
                    color={STATUS_COLORS[campaign.status] ?? 'neutral'}
                    size="small"
                  >
                    {campaign.status}
                  </Badge>
                </Box>
              ))}
              <Box marginTop="spacing.2">
                <Link
                  variant="button"
                  size="small"
                  icon={ArrowRightIcon}
                  iconPosition="right"
                  onClick={() => navigate('/admin/campaigns')}
                >
                  View all campaigns
                </Link>
              </Box>
            </Box>
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <Card width={{ base: '100%', l: '320px' }} flexShrink={0}>
          <CardHeader>
            <CardHeaderLeading title="Quick Actions" />
          </CardHeader>
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.3">
              <Button
                variant="secondary"
                isFullWidth
                icon={PlusIcon}
                onClick={() => navigate('/admin/campaigns/create')}
              >
                Create Campaign
              </Button>
              <Button
                variant="tertiary"
                isFullWidth
                icon={UsersIcon}
                onClick={() => navigate('/admin/library/advertisers')}
              >
                Manage Advertisers
              </Button>
              <Button
                variant="tertiary"
                isFullWidth
                icon={ImageIcon}
                onClick={() => navigate('/admin/library/creatives')}
              >
                Browse Creatives
              </Button>
            </Box>
          </CardBody>
        </Card>
      </Box>

      {/* Draft Campaigns Section */}
      {draftCampaigns.length > 0 && (
        <Box marginTop="spacing.6">
          <Card>
            <CardHeader>
              <CardHeaderLeading
                title="Draft Campaigns"
                subtitle="These campaigns need attention before they can be activated"
              />
            </CardHeader>
            <CardBody>
              <Box display="flex" gap="spacing.4" flexWrap="wrap">
                {draftCampaigns.map((campaign) => (
                  <Card
                    key={campaign.id}
                    padding="spacing.4"
                    width={{ base: '100%', s: '280px' }}
                    onClick={() => navigate(`/admin/campaigns/${campaign.id}`)}
                  >
                    <CardBody>
                      <Box display="flex" flexDirection="column" gap="spacing.2">
                        <Text weight="semibold">{campaign.name}</Text>
                        <Text size="xsmall" color="surface.text.gray.subtle">
                          {campaign.advertiserName}
                        </Text>
                        <Box display="flex" gap="spacing.2" marginTop="spacing.1">
                          <Badge color="information" size="small">DRAFT</Badge>
                          <Badge color="neutral" size="small">{campaign.activeAds} ads</Badge>
                        </Box>
                      </Box>
                    </CardBody>
                  </Card>
                ))}
              </Box>
            </CardBody>
          </Card>
        </Box>
      )}
    </Box>
  );
}

export default Dashboard;

