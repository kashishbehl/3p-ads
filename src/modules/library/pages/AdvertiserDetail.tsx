import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardHeaderLeading,
  CardHeaderIcon,
  Code,
  Link,
  IconButton,
  Tooltip,
  useToast,
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  ArrowLeftIcon,
  EditIcon,
  PlusIcon,
  CopyIcon,
  MailIcon,
  GlobeIcon,
  TagIcon,
  AnnouncementIcon,
} from '@razorpay/blade/components';
import { mockAdvertisers } from '../../advertisers/mocks/advertisers.mock';
import { mockCampaigns } from '../../campaigns/mocks/campaigns.mock';
import { STATUS_COLORS } from '../../../shared/constants/enums';
import { formatDate, copyToClipboard, formatCurrency } from '../../../shared/utils/formatters';

function AdvertiserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const advertiser = mockAdvertisers.find((a) => a.id === id);
  const campaigns = mockCampaigns.filter((c) => c.advertiserId === id);

  if (!advertiser) {
    return (
      <Box padding="spacing.7" display="flex" flexDirection="column" alignItems="center" gap="spacing.4">
        <Heading size="large">Advertiser Not Found</Heading>
        <Button variant="secondary" icon={ArrowLeftIcon} onClick={() => navigate('/admin/library/advertisers')}>
          Back to Advertisers
        </Button>
      </Box>
    );
  }

  const handleCopyId = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      toast.show({ content: `Copied ${text}`, color: 'positive', autoDismiss: true });
    }
  };

  const campaignTableData = { nodes: campaigns.map((c) => ({ ...c })) };

  return (
    <Box>
      {/* Back Button */}
      <Button
        variant="tertiary"
        icon={ArrowLeftIcon}
        onClick={() => navigate('/admin/library/advertisers')}
        marginBottom="spacing.4"
      >
        Back to Advertisers
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
        <Box display="flex" alignItems="center" gap="spacing.4">
          <Box>
            <Box display="flex" alignItems="center" gap="spacing.3" marginBottom="spacing.2">
              <Heading size="xlarge">{advertiser.name}</Heading>
              <Badge color={STATUS_COLORS[advertiser.status] ?? 'neutral'}>
                {advertiser.status}
              </Badge>
            </Box>
            <Box display="flex" alignItems="center" gap="spacing.2">
              <Code size="small">{advertiser.id}</Code>
              <Tooltip content="Copy ID">
                <IconButton
                  icon={CopyIcon}
                  size="small"
                  accessibilityLabel="Copy ID"
                  onClick={() => handleCopyId(advertiser.id)}
                />
              </Tooltip>
            </Box>
          </Box>
        </Box>
        <Box display="flex" gap="spacing.3">
          <Button variant="secondary" icon={EditIcon}>
            Edit
          </Button>
          <Button icon={PlusIcon} onClick={() => navigate(`/admin/campaigns/create?advertiserId=${advertiser.id}`)}>
            Create Campaign
          </Button>
        </Box>
      </Box>

      {/* Info Cards */}
      <Box display="flex" gap="spacing.5" marginBottom="spacing.6" flexWrap="wrap">
        {/* Contact Info */}
        <Card width={{ base: '100%' }} flex={{ base: 'initial', m: '1' }} minWidth={{ m: '320px' }}>
          <CardHeader>
            <CardHeaderLeading
              title="Contact Information"
              prefix={<CardHeaderIcon icon={MailIcon} />}
            />
          </CardHeader>
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.4">
              <Box>
                <Text size="small" color="surface.text.gray.subtle">Email</Text>
                <Text>{advertiser.contactEmail}</Text>
              </Box>
              {advertiser.contactPhone && (
                <Box>
                  <Text size="small" color="surface.text.gray.subtle">Phone</Text>
                  <Text>{advertiser.contactPhone}</Text>
                </Box>
              )}
              {advertiser.websiteUrl && (
                <Box>
                  <Text size="small" color="surface.text.gray.subtle">Website</Text>
                  <Link href={advertiser.websiteUrl} target="_blank" icon={GlobeIcon}>
                    {advertiser.websiteUrl}
                  </Link>
                </Box>
              )}
            </Box>
          </CardBody>
        </Card>

        {/* Business Info */}
        <Card width={{ base: '100%' }} flex={{ base: 'initial', m: '1' }} minWidth={{ m: '320px' }}>
          <CardHeader>
            <CardHeaderLeading
              title="Business Details"
              prefix={<CardHeaderIcon icon={TagIcon} />}
            />
          </CardHeader>
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.4">
              <Box>
                <Text size="small" color="surface.text.gray.subtle">Categories</Text>
                <Box display="flex" gap="spacing.2" flexWrap="wrap" marginTop="spacing.2">
                  {advertiser.businessCategories.map((cat) => (
                    <Badge key={cat} color="primary" emphasis="subtle">{cat}</Badge>
                  ))}
                </Box>
              </Box>
              <Box>
                <Text size="small" color="surface.text.gray.subtle">MCC Codes</Text>
                <Box display="flex" gap="spacing.2" flexWrap="wrap" marginTop="spacing.2">
                  {advertiser.mccCodes.map((code) => (
                    <Code key={code} size="small">{code}</Code>
                  ))}
                </Box>
              </Box>
              {advertiser.merchantId && (
                <Box>
                  <Text size="small" color="surface.text.gray.subtle">Merchant ID</Text>
                  <Box display="flex" alignItems="center" gap="spacing.2">
                    <Code>{advertiser.merchantId}</Code>
                    <IconButton
                      icon={CopyIcon}
                      size="small"
                      accessibilityLabel="Copy Merchant ID"
                      onClick={() => handleCopyId(advertiser.merchantId!)}
                    />
                  </Box>
                </Box>
              )}
              <Box>
                <Text size="small" color="surface.text.gray.subtle">Created</Text>
                <Text>{formatDate(advertiser.createdAt)}</Text>
              </Box>
            </Box>
          </CardBody>
        </Card>
      </Box>

      {/* Related Campaigns */}
      <Box marginTop="spacing.5">
        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="spacing.4">
          <Heading size="large">Campaigns ({campaigns.length})</Heading>
          <Button variant="secondary" icon={PlusIcon} onClick={() => navigate(`/admin/campaigns/create?advertiserId=${advertiser.id}`)}>
            New Campaign
          </Button>
        </Box>
        {campaigns.length === 0 ? (
          <Card>
            <CardBody>
              <Box display="flex" flexDirection="column" alignItems="center" gap="spacing.4" padding="spacing.6">
                <AnnouncementIcon size="xlarge" color="surface.icon.gray.subtle" />
                <Text color="surface.text.gray.subtle">No campaigns yet</Text>
                <Button icon={PlusIcon} onClick={() => navigate(`/admin/campaigns/create?advertiserId=${advertiser.id}`)}>
                  Create First Campaign
                </Button>
              </Box>
            </CardBody>
          </Card>
        ) : (
          <Table data={campaignTableData}>
            {(tableData) => (
              <>
                <TableHeader>
                  <TableHeaderRow>
                    <TableHeaderCell>Campaign</TableHeaderCell>
                    <TableHeaderCell>Type</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Budget</TableHeaderCell>
                    <TableHeaderCell>Active Ads</TableHeaderCell>
                    <TableHeaderCell>Created</TableHeaderCell>
                  </TableHeaderRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((campaign, index) => (
                    <TableRow key={index} item={campaign} onClick={() => navigate(`/admin/campaigns/${campaign.id}`)}>
                      <TableCell>
                        <Link variant="button" onClick={() => navigate(`/admin/campaigns/${campaign.id}`)}>
                          {campaign.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge color="primary" emphasis="subtle">{campaign.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge color={STATUS_COLORS[campaign.status] ?? 'neutral'}>{campaign.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Text size="small">{formatCurrency(campaign.totalBudget)}</Text>
                      </TableCell>
                      <TableCell>
                        <Text size="small">{campaign.activeAds}</Text>
                      </TableCell>
                      <TableCell>
                        <Text size="small">{formatDate(campaign.createdAt)}</Text>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </>
            )}
          </Table>
        )}
      </Box>
    </Box>
  );
}

export default AdvertiserDetail;

