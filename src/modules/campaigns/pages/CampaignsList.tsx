import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Button,
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TableToolbar,
  TablePagination,
  Badge,
  Text,
  Code,
  SearchInput,
  Tooltip,
  IconButton,
  Link,
  Amount,
  ProgressBar,
  useToast,
  PlusIcon,
  CopyIcon,
  EyeIcon,
  Dropdown,
  DropdownOverlay,
  SelectInput,
  ActionList,
  ActionListItem,
} from '@razorpay/blade/components';
import { mockCampaigns } from '../mocks/campaigns.mock';
import { mockAds } from '../../ads/mocks/ads.mock';
import { STATUS_COLORS, CAMPAIGN_STATUSES, CAMPAIGN_TYPES } from '../../../shared/constants/enums';
import { formatDate, copyToClipboard } from '../../../shared/utils/formatters';
import SummaryStatsBar from '../components/SummaryStatsBar';

// Inline readiness calc (lightweight, no hook needed for list view)
function getReadinessPercent(campaignId: string): number {
  const campaign = mockCampaigns.find((c) => c.id === campaignId);
  if (!campaign) return 0;
  const ads = mockAds.filter((a) => a.campaignId === campaignId);
  const adsWithCreatives = ads.filter((a) => a.mappedCreativeIds && a.mappedCreativeIds.length > 0);
  let score = 0;
  if (campaign.advertiserId) score++;
  if (campaign.totalBudget > 0 && campaign.dailyBudget > 0) score++;
  if (campaign.startDate) score++;
  if (ads.length > 0) score++;
  if (adsWithCreatives.length === ads.length && ads.length > 0) score++;
  return Math.round((score / 5) * 100);
}

function CampaignsList() {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);

  const filteredCampaigns = useMemo(() => {
    return mockCampaigns.filter((campaign) => {
      const matchesSearch =
        !searchQuery ||
        campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.advertiserName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(campaign.status);
      const matchesType = typeFilter.length === 0 || typeFilter.includes(campaign.type);

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchQuery, statusFilter, typeFilter]);

  const tableData = { nodes: filteredCampaigns.map((c) => ({ ...c })) };

  const handleCopyId = async (id: string) => {
    const success = await copyToClipboard(id);
    if (success) {
      toast.show({ content: `Copied ${id}`, color: 'positive', autoDismiss: true });
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="spacing.6">
        <Heading size="xlarge">Campaigns</Heading>
        <Button icon={PlusIcon} onClick={() => navigate('/admin/campaigns/create')}>
          Create Campaign
        </Button>
      </Box>

      <SummaryStatsBar campaigns={mockCampaigns} />

      {/* Filters */}
      <Box display="flex" gap="spacing.4" marginBottom="spacing.5" flexWrap="wrap" alignItems="flex-end">
        <Box width={{ base: '100%', s: '300px' }} flexShrink={0}>
          <SearchInput
            label="Search"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={({ value }) => setSearchQuery(value ?? '')}
            onClearButtonClick={() => setSearchQuery('')}
          />
        </Box>
        <Box width={{ base: '48%', s: '180px' }}>
          <Dropdown selectionType="multiple">
            <SelectInput label="Status" placeholder="All" onChange={({ values }) => setStatusFilter(values)} />
            <DropdownOverlay>
              <ActionList>
                {CAMPAIGN_STATUSES.map((s) => (
                  <ActionListItem key={s} title={s} value={s} />
                ))}
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        </Box>
        <Box width={{ base: '48%', s: '180px' }}>
          <Dropdown selectionType="multiple">
            <SelectInput label="Type" placeholder="All" onChange={({ values }) => setTypeFilter(values)} />
            <DropdownOverlay>
              <ActionList>
                {CAMPAIGN_TYPES.map((t) => (
                  <ActionListItem key={t} title={t} value={t} />
                ))}
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        </Box>
      </Box>

      <Table
        data={tableData}
        rowDensity="comfortable"
        toolbar={<TableToolbar title={`Showing ${filteredCampaigns.length} Campaigns`} />}
        pagination={<TablePagination defaultPageSize={10} showPageSizePicker showPageNumberSelector />}
        sortFunctions={{
          NAME: (arr) => [...arr].sort((a, b) => a.name.localeCompare(b.name)),
          BUDGET: (arr) => [...arr].sort((a, b) => a.totalBudget - b.totalBudget),
        }}
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Campaign ID</TableHeaderCell>
                <TableHeaderCell headerKey="NAME">Name</TableHeaderCell>
                <TableHeaderCell>Advertiser</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Pricing</TableHeaderCell>
                <TableHeaderCell headerKey="BUDGET" textAlign="right">Budget</TableHeaderCell>
                <TableHeaderCell textAlign="center">Readiness</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Created</TableHeaderCell>
                <TableHeaderCell textAlign="center">Actions</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((item, index) => {
                const readiness = getReadinessPercent(item.id);
                return (
                  <TableRow key={index} item={item}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap="spacing.2">
                        <Code size="small">{item.id}</Code>
                        <Tooltip content="Copy ID">
                          <IconButton icon={CopyIcon} size="small" accessibilityLabel="Copy" onClick={() => handleCopyId(item.id)} />
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Link variant="button" onClick={() => navigate(`/admin/campaigns/${item.id}`)}>
                        {item.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link variant="button" size="small" onClick={() => navigate(`/admin/library/advertisers/${item.advertiserId}`)}>
                        {item.advertiserName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge color="primary" emphasis="subtle">{item.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge color="neutral">{item.pricingModel}</Badge>
                    </TableCell>
                    <TableCell textAlign="right">
                      <Amount value={item.totalBudget / 100} type="body" size="small" currency="INR" suffix="humanize" />
                    </TableCell>
                    <TableCell textAlign="center">
                      <Box width="80px">
                        <ProgressBar
                          label=""
                          value={readiness}
                          showPercentage={false}
                          size="small"
                          accessibilityLabel={`Readiness: ${readiness}%`}
                        />
                        <Text size="xsmall" color="surface.text.gray.muted" textAlign="center">
                          {readiness}%
                        </Text>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Badge color={STATUS_COLORS[item.status] ?? 'neutral'}>{item.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Text size="small">{formatDate(item.createdAt)}</Text>
                    </TableCell>
                    <TableCell textAlign="center">
                      <Tooltip content="Open Workspace">
                        <IconButton icon={EyeIcon} size="small" accessibilityLabel="View" onClick={() => navigate(`/admin/campaigns/${item.id}`)} />
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </>
        )}
      </Table>
    </Box>
  );
}

export default CampaignsList;
