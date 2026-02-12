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
  TablePagination,
  Badge,
  Text,
  Code,
  SearchInput,
  Tooltip,
  IconButton,
  Link,
  Card,
  CardBody,
  useToast,
  PlusIcon,
  CopyIcon,
  EyeIcon,
  EditIcon,
  GridIcon,
  ListIcon,
  Dropdown,
  DropdownOverlay,
  SelectInput,
  ActionList,
  ActionListItem,
} from '@razorpay/blade/components';
import { mockCreatives } from '../../creatives/mocks/creatives.mock';
import { mockAdvertisers } from '../../advertisers/mocks/advertisers.mock';
import { CREATIVE_TYPES } from '../../../shared/constants/enums';
import { formatDate, copyToClipboard } from '../../../shared/utils/formatters';
import CreateCreativeModal from '../components/CreateCreativeModal';

function CreativesList() {
  const navigate = useNavigate();
  const toast = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [advertiserFilter, setAdvertiserFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredCreatives = useMemo(() => {
    return mockCreatives.filter((creative) => {
      const matchesSearch =
        !searchQuery ||
        creative.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creative.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesAdvertiser =
        advertiserFilter.length === 0 || advertiserFilter.includes(creative.advertiserId);

      const matchesType = typeFilter.length === 0 || typeFilter.includes(creative.type);

      return matchesSearch && matchesAdvertiser && matchesType;
    });
  }, [searchQuery, advertiserFilter, typeFilter]);

  const handleCopyId = async (id: string) => {
    const success = await copyToClipboard(id);
    if (success) {
      toast.show({ content: `Copied ${id}`, color: 'positive', autoDismiss: true });
    }
  };

  const tableData = { nodes: filteredCreatives.map((c) => ({ ...c })) };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="spacing.6">
        <Heading size="xlarge">Creatives</Heading>
        <Box display="flex" gap="spacing.3">
          <Box display="flex" gap="spacing.1">
            <Tooltip content="Grid View">
              <IconButton
                icon={GridIcon}
                size="medium"
                accessibilityLabel="Grid view"
                emphasis={viewMode === 'grid' ? 'intense' : 'subtle'}
                onClick={() => setViewMode('grid')}
              />
            </Tooltip>
            <Tooltip content="Table View">
              <IconButton
                icon={ListIcon}
                size="medium"
                accessibilityLabel="Table view"
                emphasis={viewMode === 'table' ? 'intense' : 'subtle'}
                onClick={() => setViewMode('table')}
              />
            </Tooltip>
          </Box>
          <Button icon={PlusIcon} onClick={() => setIsCreateModalOpen(true)}>
            Create Creative
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Box display="flex" gap="spacing.4" marginBottom="spacing.5" flexWrap="wrap" alignItems="flex-end">
        <Box width={{ base: '100%', s: '300px' }} flexShrink={0}>
          <SearchInput
            label="Search"
            placeholder="Search creatives..."
            value={searchQuery}
            onChange={({ value }) => setSearchQuery(value ?? '')}
            onClearButtonClick={() => setSearchQuery('')}
          />
        </Box>
        <Box width={{ base: '48%', s: '200px' }}>
          <Dropdown selectionType="multiple">
            <SelectInput label="Advertiser" placeholder="All" onChange={({ values }) => setAdvertiserFilter(values)} />
            <DropdownOverlay>
              <ActionList>
                {mockAdvertisers.map((adv) => (
                  <ActionListItem key={adv.id} title={adv.name} value={adv.id} />
                ))}
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        </Box>
        <Box width={{ base: '48%', s: '160px' }}>
          <Dropdown selectionType="multiple">
            <SelectInput label="Type" placeholder="All" onChange={({ values }) => setTypeFilter(values)} />
            <DropdownOverlay>
              <ActionList>
                {CREATIVE_TYPES.map((t) => (
                  <ActionListItem key={t} title={t} value={t} />
                ))}
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        </Box>
      </Box>

      <Text size="small" color="surface.text.gray.subtle" marginBottom="spacing.4">
        Showing {filteredCreatives.length} creatives
      </Text>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <Box display="flex" gap="spacing.5" flexWrap="wrap">
          {filteredCreatives.map((creative) => (
            <Card
              key={creative.id}
              width={{ base: '100%', s: '280px' }}
            >
              <CardBody>
                {/* Image Preview */}
                <Box
                  height="160px"
                  backgroundColor="surface.background.gray.moderate"
                  borderRadius="medium"
                  overflow="hidden"
                  marginBottom="spacing.4"
                >
                  {creative.assets[0] && (
                    <img
                      src={creative.assets[0].url}
                      alt={creative.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )}
                </Box>

                {/* Creative Info */}
                <Text weight="semibold" truncateAfterLines={1} marginBottom="spacing.2">
                  {creative.name}
                </Text>
                <Box display="flex" alignItems="center" gap="spacing.2" marginBottom="spacing.2">
                  <Badge color="primary" emphasis="subtle">{creative.type}</Badge>
                  <Badge color="neutral">{creative.assets.length} assets</Badge>
                </Box>
                <Text size="small" color="surface.text.gray.subtle" marginBottom="spacing.2">
                  {creative.advertiserName}
                </Text>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Text size="xsmall" color="surface.text.gray.subtle">
                    Used in {creative.usedInAds} ads
                  </Text>
                  <Box display="flex" gap="spacing.1">
                    <Tooltip content="Copy ID">
                      <IconButton
                        icon={CopyIcon}
                        size="small"
                        accessibilityLabel="Copy ID"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyId(creative.id);
                        }}
                      />
                    </Tooltip>
                  </Box>
                </Box>
              </CardBody>
            </Card>
          ))}
        </Box>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <Table
          data={tableData}
          rowDensity="comfortable"
          pagination={<TablePagination defaultPageSize={10} showPageSizePicker showPageNumberSelector />}
        >
          {(tableData) => (
            <>
              <TableHeader>
                <TableHeaderRow>
                  <TableHeaderCell>Preview</TableHeaderCell>
                  <TableHeaderCell>Creative ID</TableHeaderCell>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>Advertiser</TableHeaderCell>
                  <TableHeaderCell>Type</TableHeaderCell>
                  <TableHeaderCell textAlign="center">Assets</TableHeaderCell>
                  <TableHeaderCell textAlign="center">Used In</TableHeaderCell>
                  <TableHeaderCell>CTA</TableHeaderCell>
                  <TableHeaderCell>Created</TableHeaderCell>
                  <TableHeaderCell textAlign="center">Actions</TableHeaderCell>
                </TableHeaderRow>
              </TableHeader>
              <TableBody>
                {tableData.map((item, index) => (
                  <TableRow key={index} item={item}>
                    <TableCell>
                      <Box
                        width="48px"
                        height="48px"
                        backgroundColor="surface.background.gray.moderate"
                        borderRadius="small"
                        overflow="hidden"
                      >
                        {item.assets[0] && (
                          <img
                            src={item.assets[0].url}
                            alt={item.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap="spacing.2">
                        <Code size="small">{item.id}</Code>
                        <Tooltip content="Copy ID">
                          <IconButton icon={CopyIcon} size="small" accessibilityLabel="Copy" onClick={() => handleCopyId(item.id)} />
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Text weight="semibold" truncateAfterLines={1}>{item.name}</Text>
                    </TableCell>
                    <TableCell>
                      <Link variant="button" size="small" onClick={() => navigate(`/admin/library/advertisers/${item.advertiserId}`)}>
                        {item.advertiserName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge color="primary" emphasis="subtle">{item.type}</Badge>
                    </TableCell>
                    <TableCell textAlign="center">
                      <Badge color="neutral">{String(item.assets.length)}</Badge>
                    </TableCell>
                    <TableCell textAlign="center">
                      <Badge color={item.usedInAds > 0 ? 'positive' : 'neutral'}>
                        {String(item.usedInAds)} ads
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Text size="small" truncateAfterLines={1}>{item.ctaText}</Text>
                    </TableCell>
                    <TableCell>
                      <Text size="small">{formatDate(item.createdAt)}</Text>
                    </TableCell>
                    <TableCell textAlign="center">
                      <Box display="flex" gap="spacing.2" justifyContent="center">
                        <Tooltip content="View">
                          <IconButton icon={EyeIcon} size="small" accessibilityLabel="View" onClick={() => navigate(`/admin/library/creatives/${item.id}`)} />
                        </Tooltip>
                        <Tooltip content="Edit">
                          <IconButton icon={EditIcon} size="small" accessibilityLabel="Edit" onClick={() => navigate(`/admin/library/creatives/${item.id}`)} />
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          )}
        </Table>
      )}

      <CreateCreativeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </Box>
  );
}

export default CreativesList;

