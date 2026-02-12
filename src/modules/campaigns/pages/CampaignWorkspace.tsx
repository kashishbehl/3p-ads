import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Badge,
  Button,
  Code,
  Link,
  IconButton,
  Tooltip,
  Tabs,
  TabList,
  TabItem,
  TabPanel,
  ArrowLeftIcon,
  CopyIcon,
  useToast,
} from '@razorpay/blade/components';
import { mockCampaigns } from '../mocks/campaigns.mock';
import { mockAds } from '../../ads/mocks/ads.mock';
import { STATUS_COLORS } from '../../../shared/constants/enums';
import { copyToClipboard } from '../../../shared/utils/formatters';
import OverviewTab from '../components/workspace/OverviewTab';
import AdsTab from '../components/workspace/AdsTab';
import CreativesTab from '../components/workspace/CreativesTab';
import PerformanceTab from '../components/workspace/PerformanceTab';
import CampaignActions from '../components/CampaignActions';
import ActivationChecklist from '../components/ActivationChecklist';
import MapCreativesModal from '../components/MapCreativesModal';

function CampaignWorkspace() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [showActivationChecklist, setShowActivationChecklist] = useState(false);
  const [mapCreativesAdId, setMapCreativesAdId] = useState<string | null>(null);

  const campaign = mockCampaigns.find((c) => c.id === id);
  const campaignAds = mockAds.filter((a) => a.campaignId === id);

  if (!campaign) {
    return (
      <Box padding="spacing.7" display="flex" flexDirection="column" alignItems="center" gap="spacing.4">
        <Heading size="large">Campaign Not Found</Heading>
        <Button variant="secondary" icon={ArrowLeftIcon} onClick={() => navigate('/admin/campaigns')}>
          Back to Campaigns
        </Button>
      </Box>
    );
  }

  const handleCopyId = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) toast.show({ content: `Copied ${text}`, color: 'positive', autoDismiss: true });
  };

  const mapCreativesAd = mapCreativesAdId ? mockAds.find((a) => a.id === mapCreativesAdId) : null;

  return (
    <Box>
      <Button
        variant="tertiary"
        icon={ArrowLeftIcon}
        onClick={() => navigate('/admin/campaigns')}
        marginBottom="spacing.4"
      >
        Back to Campaigns
      </Button>

      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        marginBottom="spacing.6"
        flexWrap="wrap"
        gap="spacing.4"
      >
        <Box>
          <Box display="flex" alignItems="center" gap="spacing.3" marginBottom="spacing.2">
            <Heading size="xlarge">{campaign.name}</Heading>
            <Badge color={STATUS_COLORS[campaign.status] ?? 'neutral'}>{campaign.status}</Badge>
          </Box>
          <Box display="flex" alignItems="center" gap="spacing.2">
            <Code size="small">{campaign.id}</Code>
            <Tooltip content="Copy ID">
              <IconButton
                icon={CopyIcon}
                size="small"
                accessibilityLabel="Copy"
                onClick={() => handleCopyId(campaign.id)}
              />
            </Tooltip>
            <Text size="small" color="surface.text.gray.subtle">·</Text>
            <Link
              variant="button"
              size="small"
              onClick={() => navigate(`/admin/library/advertisers/${campaign.advertiserId}`)}
            >
              {campaign.advertiserName}
            </Link>
          </Box>
        </Box>
        <CampaignActions
          campaign={campaign}
          onActivate={() => setShowActivationChecklist(true)}
        />
      </Box>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={(value) => setActiveTab(value)}>
        <TabList>
          <TabItem value="overview">Overview</TabItem>
          <TabItem
            value="ads"
            trailing={<Badge color="neutral">{String(campaignAds.length)}</Badge>}
          >
            Ads
          </TabItem>
          <TabItem value="creatives">Creatives</TabItem>
          <TabItem value="performance">Performance</TabItem>
        </TabList>

        <TabPanel value="overview">
          <OverviewTab campaign={campaign} />
        </TabPanel>

        <TabPanel value="ads">
          <AdsTab
            campaign={campaign}
            onMapCreatives={(adId) => setMapCreativesAdId(adId)}
          />
        </TabPanel>

        <TabPanel value="creatives">
          <CreativesTab campaign={campaign} />
        </TabPanel>

        <TabPanel value="performance">
          <PerformanceTab />
        </TabPanel>
      </Tabs>

      {/* Activation Checklist Modal */}
      <ActivationChecklist
        isOpen={showActivationChecklist}
        onClose={() => setShowActivationChecklist(false)}
        campaign={campaign}
      />

      {/* Map Creatives Modal */}
      {mapCreativesAdId && mapCreativesAd && (
        <MapCreativesModal
          isOpen={Boolean(mapCreativesAdId)}
          onClose={() => setMapCreativesAdId(null)}
          adId={mapCreativesAdId}
          advertiserId={campaign.advertiserId}
        />
      )}
    </Box>
  );
}

export default CampaignWorkspace;

