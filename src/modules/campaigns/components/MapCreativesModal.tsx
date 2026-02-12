import React, { useState } from 'react';
import {
  Box,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
  Badge,
  Text,
  Checkbox,
  SearchInput,
  Alert,
  useToast,
} from '@razorpay/blade/components';
import { mockCreatives } from '../../creatives/mocks/creatives.mock';
import { mockAds } from '../../ads/mocks/ads.mock';
import { CREATIVE_TYPES } from '../../../shared/constants/enums';

interface MapCreativesModalProps {
  isOpen: boolean;
  onClose: () => void;
  adId: string;
  advertiserId: string;
}

function MapCreativesModal({ isOpen, onClose, adId, advertiserId }: MapCreativesModalProps) {
  const toast = useToast();
  const ad = mockAds.find((a) => a.id === adId);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>(ad?.mappedCreativeIds ?? []);

  const availableCreatives = mockCreatives.filter(
    (c) =>
      c.advertiserId === advertiserId &&
      (!searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.type.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    toast.show({
      content: `Mapped ${selectedIds.length} creatives to "${ad?.name}"`,
      color: 'positive',
      autoDismiss: true,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onDismiss={onClose} size="large" accessibilityLabel="Map Creatives">
      <ModalHeader
        title="Map Creatives"
        subtitle={`Select creatives for ${ad?.name ?? 'this ad'}`}
      />
      <ModalBody>
        <Box display="flex" flexDirection="column" gap="spacing.4">
          <SearchInput
            label="Search Creatives"
            placeholder="Search by name or type..."
            value={searchQuery}
            onChange={({ value }) => setSearchQuery(value ?? '')}
            onClearButtonClick={() => setSearchQuery('')}
          />

          <Box display="flex" gap="spacing.3" alignItems="center">
            <Badge color="primary">{String(selectedIds.length)} selected</Badge>
          </Box>

          {availableCreatives.length === 0 ? (
            <Alert
              color="information"
              description="No creatives found for this advertiser."
              isDismissible={false}
            />
          ) : (
            <Box display="flex" gap="spacing.4" flexWrap="wrap" maxHeight="400px" overflowY="auto">
              {availableCreatives.map((creative) => {
                const isSelected = selectedIds.includes(creative.id);
                return (
                  <Card
                    key={creative.id}
                    width={{ base: '100%', s: '220px' }}
                    onClick={() => handleToggle(creative.id)}
                    backgroundColor={isSelected ? 'surface.background.primary.subtle' : undefined}
                  >
                    <CardBody>
                      <Box display="flex" alignItems="center" gap="spacing.2" marginBottom="spacing.3">
                        <Checkbox
                          isChecked={isSelected}
                          onChange={() => handleToggle(creative.id)}
                        >
                          {''}
                        </Checkbox>
                        <Text weight="semibold" size="small" truncateAfterLines={1}>
                          {creative.name}
                        </Text>
                      </Box>
                      <Box
                        height="100px"
                        backgroundColor="surface.background.gray.moderate"
                        borderRadius="small"
                        overflow="hidden"
                        marginBottom="spacing.3"
                      >
                        {creative.assets[0] && (
                          <img
                            src={creative.assets[0].url}
                            alt={creative.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        )}
                      </Box>
                      <Box display="flex" gap="spacing.2">
                        <Badge color="primary" emphasis="subtle" size="small">{creative.type}</Badge>
                        <Badge color="neutral" size="small">{creative.assets.length} assets</Badge>
                      </Box>
                    </CardBody>
                  </Card>
                );
              })}
            </Box>
          )}
        </Box>
      </ModalBody>
      <ModalFooter>
        <Box display="flex" gap="spacing.3" justifyContent="flex-end" width="100%">
          <Button variant="tertiary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save ({selectedIds.length} creatives)</Button>
        </Box>
      </ModalFooter>
    </Modal>
  );
}

export default MapCreativesModal;

