import React, { useState, useMemo } from 'react';
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
  SearchInput,
  Dropdown,
  DropdownOverlay,
  SelectInput,
  ActionList,
  ActionListItem,
  PlusIcon,
} from '@razorpay/blade/components';
import { mockSegments } from '../mocks/segments.mock';
import { formatDate } from '../../../shared/utils/formatters';
import CreateSegmentModal from '../components/CreateSegmentModal';

function SegmentsList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredSegments = useMemo(() => {
    return mockSegments.filter((segment) => {
      const matchesSearch =
        !searchQuery ||
        segment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        segment.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter.length === 0 || categoryFilter.includes(segment.category);

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);

  const tableData = {
    nodes: filteredSegments.map((segment) => ({ ...segment })),
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="spacing.6">
        <Heading size="xlarge">Segments</Heading>
        <Button icon={PlusIcon} onClick={() => setIsCreateModalOpen(true)}>
          Create Segment
        </Button>
      </Box>

      {/* Filters */}
      <Box display="flex" gap="spacing.4" marginBottom="spacing.5" flexWrap="wrap" alignItems="flex-end">
        <Box width={{ base: '100%', s: '300px' }} flexShrink={0}>
          <SearchInput
            label="Search"
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={({ value }) => setSearchQuery(value ?? '')}
            onClearButtonClick={() => setSearchQuery('')}
          />
        </Box>
        <Box width={{ base: '100%', s: '200px' }}>
          <Dropdown selectionType="multiple">
            <SelectInput
              label="Category"
              placeholder="All Categories"
              onChange={({ values }) => setCategoryFilter(values)}
            />
            <DropdownOverlay>
              <ActionList>
                <ActionListItem title="Retail" value="retail" />
                <ActionListItem title="Restricted" value="restricted" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        </Box>
      </Box>

      {/* Summary Stats */}
      <Box
        padding="spacing.5"
        backgroundColor="surface.background.gray.subtle"
        borderRadius="medium"
        marginBottom="spacing.5"
      >
        <Box display="flex" gap="spacing.8">
          <Box>
            <Text size="small" color="surface.text.gray.subtle" weight="medium">
              Total Segments
            </Text>
            <Text size="large" weight="semibold">
              {filteredSegments.length}
            </Text>
          </Box>
          <Box>
            <Text size="small" color="surface.text.gray.subtle" weight="medium">
              Retail
            </Text>
            <Text size="large" weight="semibold">
              {filteredSegments.filter((s) => s.category === 'retail').length}
            </Text>
          </Box>
          <Box>
            <Text size="small" color="surface.text.gray.subtle" weight="medium">
              Restricted
            </Text>
            <Text size="large" weight="semibold">
              {filteredSegments.filter((s) => s.category === 'restricted').length}
            </Text>
          </Box>
        </Box>
      </Box>

      {/* Table */}
      <Table data={tableData}>
        {({ TablePagination: TablePaginationComponent }) => (
          <>
            <TableToolbar>
              <TableToolbarActions>
                <Box display="flex" alignItems="center" gap="spacing.3">
                  <Text size="medium" weight="semibold">
                    {filteredSegments.length} segments
                  </Text>
                </Box>
              </TableToolbarActions>
            </TableToolbar>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Segment ID</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Description</TableHeaderCell>
                <TableHeaderCell>Category</TableHeaderCell>
                <TableHeaderCell>Created</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {({ item }) => {
                return (
                  <TableRow item={item}>
                    <TableCell>
                      <Text size="small" color="surface.text.gray.muted" weight="medium">
                        {item.id}
                      </Text>
                    </TableCell>
                    <TableCell>
                      <Text weight="semibold">{item.name}</Text>
                    </TableCell>
                    <TableCell>
                      <Text size="small" color="surface.text.gray.subtle">
                        {item.description || '—'}
                      </Text>
                    </TableCell>
                    <TableCell>
                      <Badge
                        color={item.category === 'restricted' ? 'negative' : 'primary'}
                        size="small"
                      >
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Text size="small" color="surface.text.gray.subtle">
                        {formatDate(item.createdAt)}
                      </Text>
                    </TableCell>
                  </TableRow>
                );
              }}
            </TableBody>
            <TablePaginationComponent
              showPageNumberSelector
              showPageSizeSelector
              defaultPageSize={10}
            />
          </>
        )}
      </Table>

      <CreateSegmentModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </Box>
  );
}

export default SegmentsList;
