import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Text,
  Badge,
  SearchInput,
  Checkbox,
  Card,
  CardBody,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@razorpay/blade/components';
import { mockCreatives } from '../../creatives/mocks/creatives.mock';

interface CreativePickerGridProps {
  /** When used inline (without modal wrapper) */
  advertiserId: string;
  initialSelectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  /** When used as a standalone modal */
  isOpen?: boolean;
  onClose?: () => void;
  onSave?: (selectedIds: string[]) => void;
  currentMappedIds?: string[];
}

function CreativePickerGrid({
  advertiserId,
  initialSelectedIds = [],
  onSelectionChange,
  isOpen,
  onClose,
  onSave,
  currentMappedIds = [],
}: CreativePickerGridProps) {
  const effectiveInitial = isOpen !== undefined ? currentMappedIds : initialSelectedIds;
  const [selectedIds, setSelectedIds] = useState<string[]>(effectiveInitial);
  const [searchQuery, setSearchQuery] = useState('');

  // Reset selection when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedIds(currentMappedIds);
      setSearchQuery('');
    }
  }, [isOpen, currentMappedIds]);

  const advertiserCreatives = useMemo(() => {
    return mockCreatives.filter((c) => c.advertiserId === advertiserId);
  }, [advertiserId]);

  const filteredCreatives = useMemo(() => {
    if (!searchQuery) return advertiserCreatives;
    return advertiserCreatives.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [advertiserCreatives, searchQuery]);

  const toggleCreative = (creativeId: string) => {
    setSelectedIds((prev) => {
      const next = prev.includes(creativeId)
        ? prev.filter((id) => id !== creativeId)
        : [...prev, creativeId];
      onSelectionChange?.(next);
      return next;
    });
  };

  const renderGrid = () => (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      <SearchInput
        label="Search Creatives"
        placeholder="Search by name or ID..."
        value={searchQuery}
        onChange={({ value }) => setSearchQuery(value ?? '')}
        onClearButtonClick={() => setSearchQuery('')}
      />

      <Text size="small" color="surface.text.gray.subtle">
        {filteredCreatives.length} creatives available • {selectedIds.length} selected
      </Text>

      {filteredCreatives.length === 0 && (
        <Alert
          color="information"
          description="No creatives found for this advertiser. Create creatives in the Library first."
          isDismissible={false}
        />
      )}

      <Box display="flex" gap="spacing.4" flexWrap="wrap">
        {filteredCreatives.map((creative) => {
          const isSelected = selectedIds.includes(creative.id);
          return (
            <Card
              key={creative.id}
              width={{ base: '100%', s: '220px' }}
              onClick={() => toggleCreative(creative.id)}
            >
              <CardBody>
                <Box display="flex" flexDirection="column" gap="spacing.3">
                  {/* Image Preview */}
                  <Box
                    height="120px"
                    backgroundColor="surface.background.gray.moderate"
                    borderRadius="medium"
                    overflow="hidden"
                    position="relative"
                  >
                    {creative.assets[0] && (
                      <img
                        src={creative.assets[0].url}
                        alt={creative.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )}
                    <Box position="absolute" top="spacing.2" right="spacing.2">
                      <Checkbox
                        isChecked={isSelected}
                        onChange={() => toggleCreative(creative.id)}
                      />
                    </Box>
                  </Box>

                  <Text weight="semibold" size="small" truncateAfterLines={1}>
                    {creative.name}
                  </Text>
                  <Box display="flex" gap="spacing.2" flexWrap="wrap">
                    <Badge color="primary" emphasis="subtle" size="small">
                      {creative.type}
                    </Badge>
                    <Badge color="neutral" size="small">
                      {creative.assets.length} assets
                    </Badge>
                  </Box>
                </Box>
              </CardBody>
            </Card>
          );
        })}
      </Box>
    </Box>
  );

  // When used as a standalone modal
  if (isOpen !== undefined && onClose && onSave) {
    return (
      <Modal isOpen={isOpen} onDismiss={onClose} size="large" accessibilityLabel="Select Creatives">
        <ModalHeader
          title="Select Creatives"
          subtitle="Choose creatives to attach to this ad"
        />
        <ModalBody>{renderGrid()}</ModalBody>
        <ModalFooter>
          <Box display="flex" gap="spacing.3" justifyContent="flex-end" width="100%">
            <Button variant="tertiary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => onSave(selectedIds)}>
              Save ({selectedIds.length} selected)
            </Button>
          </Box>
        </ModalFooter>
      </Modal>
    );
  }

  // When used inline
  return renderGrid();
}

export default CreativePickerGrid;

