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
  TableToolbarActions,
  TablePagination,
  Badge,
  Text,
  Code,
  SearchInput,
  Tooltip,
  IconButton,
  Link,
  useToast,
  PlusIcon,
  CopyIcon,
  EditIcon,
  EyeIcon,
  Dropdown,
  DropdownOverlay,
  SelectInput,
  ActionList,
  ActionListItem,
} from '@razorpay/blade/components';
import { mockAdvertisers } from '../../advertisers/mocks/advertisers.mock';
import { STATUS_COLORS } from '../../../shared/constants/enums';
import { formatDate, copyToClipboard } from '../../../shared/utils/formatters';
import CreateAdvertiserModal from '../components/CreateAdvertiserModal';

function AdvertisersList() {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredAdvertisers = useMemo(() => {
    return mockAdvertisers.filter((adv) => {
      const matchesSearch =
        !searchQuery ||
        adv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        adv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        adv.contactEmail.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter.length === 0 || statusFilter.includes(adv.status);

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const tableData = {
    nodes: filteredAdvertisers.map((adv) => ({ ...adv })),
  };

  const handleCopyId = async (id: string) => {
    const success = await copyToClipboard(id);
    if (success) {
      toast.show({ content: `Copied ${id}`, color: 'positive', autoDismiss: true });
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="spacing.6">
        <Heading size="xlarge">Advertisers</Heading>
        <Button icon={PlusIcon} onClick={() => setIsCreateModalOpen(true)}>
          Create Advertiser
        </Button>
      </Box>

      {/* Filters */}
      <Box display="flex" gap="spacing.4" marginBottom="spacing.5" flexWrap="wrap" alignItems="flex-end">
        <Box width={{ base: '100%', s: '300px' }} flexShrink={0}>
          <SearchInput
            label="Search"
            placeholder="Search by name, ID, or email..."
            value={searchQuery}
            onChange={({ value }) => setSearchQuery(value ?? '')}
            onClearButtonClick={() => setSearchQuery('')}
          />
        </Box>
        <Box width={{ base: '100%', s: '200px' }}>
          <Dropdown selectionType="multiple">
            <SelectInput
              label="Status"
              placeholder="All Statuses"
              onChange={({ values }) => setStatusFilter(values)}
            />
            <DropdownOverlay>
              <ActionList>
                <ActionListItem title="Active" value="ACTIVE" />
                <ActionListItem title="Inactive" value="INACTIVE" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        </Box>
      </Box>

      {/* Table */}
      <Table
        data={tableData}
        rowDensity="comfortable"
        toolbar={
          <TableToolbar title={`Showing ${filteredAdvertisers.length} Advertisers`}>
            <TableToolbarActions>
              <Button variant="secondary" size="small" icon={PlusIcon} onClick={() => setIsCreateModalOpen(true)}>
                Add New
              </Button>
            </TableToolbarActions>
          </TableToolbar>
        }
        pagination={<TablePagination defaultPageSize={10} showPageSizePicker showPageNumberSelector />}
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Advertiser ID</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Merchant ID</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell textAlign="center">Active Campaigns</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Created</TableHeaderCell>
                <TableHeaderCell textAlign="center">Actions</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((item, index) => (
                <TableRow key={index} item={item}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap="spacing.2">
                      <Code size="small">{item.id}</Code>
                      <Tooltip content="Copy ID">
                        <IconButton
                          icon={CopyIcon}
                          size="small"
                          accessibilityLabel="Copy advertiser ID"
                          onClick={() => handleCopyId(item.id)}
                        />
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Link
                      variant="button"
                      onClick={() => navigate(`/admin/library/advertisers/${item.id}`)}
                    >
                      {item.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Text size="small" color="surface.text.gray.subtle">
                      {item.merchantId ?? '—'}
                    </Text>
                  </TableCell>
                  <TableCell>
                    <Text size="small">{item.contactEmail}</Text>
                  </TableCell>
                  <TableCell textAlign="center">
                    <Badge color={item.activeCampaigns > 0 ? 'positive' : 'neutral'}>
                      {String(item.activeCampaigns)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge color={STATUS_COLORS[item.status] ?? 'neutral'}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Text size="small">{formatDate(item.createdAt)}</Text>
                  </TableCell>
                  <TableCell textAlign="center">
                    <Box display="flex" gap="spacing.2" justifyContent="center">
                      <Tooltip content="View Details">
                        <IconButton
                          icon={EyeIcon}
                          size="small"
                          accessibilityLabel="View advertiser"
                          onClick={() => navigate(`/admin/library/advertisers/${item.id}`)}
                        />
                      </Tooltip>
                      <Tooltip content="Edit">
                        <IconButton
                          icon={EditIcon}
                          size="small"
                          accessibilityLabel="Edit advertiser"
                          onClick={() => navigate(`/admin/library/advertisers/${item.id}`)}
                        />
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>

      <CreateAdvertiserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </Box>
  );
}

export default AdvertisersList;

