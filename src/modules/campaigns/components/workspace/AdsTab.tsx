import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Badge,
  Button,
  Card,
  CardBody,
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Link,
  IconButton,
  Tooltip,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  TextInput,
  RadioGroup,
  Radio,
  Alert,
  useToast,
  PlusIcon,
  EditIcon,
  TrashIcon,
} from '@razorpay/blade/components';
import { mockAds } from '../../../ads/mocks/ads.mock';
import type { Campaign } from '../../types';
import type { Ad } from '../../../ads/types';
import { AD_TYPES } from '../../../../shared/constants/enums';
import { formatDate } from '../../../../shared/utils/formatters';

interface AdsTabProps {
  campaign: Campaign;
  onMapCreatives: (adId: string) => void;
}

function AdsTab({ campaign, onMapCreatives }: AdsTabProps) {
  const toast = useToast();
  const campaignAds = mockAds.filter((a) => a.campaignId === campaign.id);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newAdName, setNewAdName] = useState('');
  const [newAdType, setNewAdType] = useState('BANNER');
  const [newAdRewardId, setNewAdRewardId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const tableData = { nodes: campaignAds.map((a) => ({ ...a })) };

  const handleCreateAd = () => {
    const newErrors: Record<string, string> = {};
    if (!newAdName.trim()) newErrors.name = 'Ad name is required';
    if (newAdType === 'SCRATCH_CARD' && !newAdRewardId.trim())
      newErrors.rewardId = 'Reward ID is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    toast.show({
      content: `Ad "${newAdName}" created for "${campaign.name}"`,
      color: 'positive',
      autoDismiss: true,
    });
    setIsCreateModalOpen(false);
    setNewAdName('');
    setNewAdType('BANNER');
    setNewAdRewardId('');
    setErrors({});
  };

  return (
    <Box paddingTop="spacing.5">
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="spacing.4">
        <Heading size="medium">Campaign Ads ({campaignAds.length})</Heading>
        {campaign.status !== 'TERMINATED' && (
          <Button icon={PlusIcon} size="small" onClick={() => setIsCreateModalOpen(true)}>
            Add Ad
          </Button>
        )}
      </Box>

      {campaignAds.length === 0 ? (
        <Card>
          <CardBody>
            <Box display="flex" flexDirection="column" alignItems="center" gap="spacing.4" padding="spacing.6">
              <Text color="surface.text.gray.subtle">No ads in this campaign yet</Text>
              <Button icon={PlusIcon} onClick={() => setIsCreateModalOpen(true)}>
                Create First Ad
              </Button>
            </Box>
          </CardBody>
        </Card>
      ) : (
        <Table data={tableData}>
          {(tableData) => (
            <>
              <TableHeader>
                <TableHeaderRow>
                  <TableHeaderCell>Ad Name</TableHeaderCell>
                  <TableHeaderCell>Type</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell textAlign="center">Creatives</TableHeaderCell>
                  <TableHeaderCell>Created</TableHeaderCell>
                  <TableHeaderCell textAlign="center">Actions</TableHeaderCell>
                </TableHeaderRow>
              </TableHeader>
              <TableBody>
                {tableData.map((ad, index) => (
                  <TableRow key={index} item={ad}>
                    <TableCell>
                      <Text weight="semibold">{ad.name}</Text>
                    </TableCell>
                    <TableCell>
                      <Badge color={ad.type === 'SCRATCH_CARD' ? 'notice' : 'primary'} emphasis="subtle">
                        {ad.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge color={ad.status ? 'positive' : 'neutral'}>
                        {ad.status ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell textAlign="center">
                      <Badge color={ad.creativesMapped > 0 ? 'positive' : 'negative'} size="small">
                        {String(ad.creativesMapped)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Text size="small">{formatDate(ad.createdAt)}</Text>
                    </TableCell>
                    <TableCell textAlign="center">
                      <Box display="flex" gap="spacing.2" justifyContent="center">
                        <Tooltip content="Map Creatives">
                          <IconButton
                            icon={EditIcon}
                            size="small"
                            accessibilityLabel="Map Creatives"
                            onClick={() => onMapCreatives(ad.id)}
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
      )}

      {/* Create Ad Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onDismiss={() => setIsCreateModalOpen(false)}
        size="medium"
        accessibilityLabel="Create Ad"
      >
        <ModalHeader title="Add Ad to Campaign" subtitle={campaign.name} />
        <ModalBody>
          <Box display="flex" flexDirection="column" gap="spacing.5">
            <TextInput
              label="Ad Name"
              placeholder={`e.g., ${campaign.name} Banner`}
              value={newAdName}
              onChange={({ value }) => {
                setNewAdName(value ?? '');
                if (errors.name) setErrors((p) => ({ ...p, name: '' }));
              }}
              necessityIndicator="required"
              validationState={errors.name ? 'error' : 'none'}
              errorText={errors.name}
            />
            <RadioGroup
              label="Ad Type"
              value={newAdType}
              onChange={({ value }) => setNewAdType(value)}
              name="newAdType"
            >
              {AD_TYPES.map((t) => (
                <Radio key={t} value={t} helpText={t === 'SCRATCH_CARD' ? 'Requires Reward ID' : 'Standard display ad'}>
                  {t.replace('_', ' ')}
                </Radio>
              ))}
            </RadioGroup>
            {newAdType === 'SCRATCH_CARD' && (
              <TextInput
                label="Reward ID"
                placeholder="21-character reward identifier"
                value={newAdRewardId}
                onChange={({ value }) => {
                  setNewAdRewardId(value ?? '');
                  if (errors.rewardId) setErrors((p) => ({ ...p, rewardId: '' }));
                }}
                necessityIndicator="required"
                validationState={errors.rewardId ? 'error' : 'none'}
                errorText={errors.rewardId}
                maxCharacters={21}
              />
            )}
          </Box>
        </ModalBody>
        <ModalFooter>
          <Box display="flex" gap="spacing.3" justifyContent="flex-end" width="100%">
            <Button variant="tertiary" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateAd}>Create Ad</Button>
          </Box>
        </ModalFooter>
      </Modal>
    </Box>
  );
}

export default AdsTab;

