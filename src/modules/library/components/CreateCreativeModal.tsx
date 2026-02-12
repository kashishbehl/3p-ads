import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  TextInput,
  TextArea,
  RadioGroup,
  Radio,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
  CardHeader,
  CardHeaderLeading,
  Badge,
  Divider,
  Alert,
  useToast,
  PlusIcon,
  TrashIcon,
  IconButton,
  Tooltip,
  Dropdown,
  DropdownOverlay,
  SelectInput,
  ActionList,
  ActionListItem,
} from '@razorpay/blade/components';
import { useNavigate } from 'react-router-dom';
import { mockAdvertisers } from '../../advertisers/mocks/advertisers.mock';
import { CREATIVE_TYPES, ASPECT_RATIOS } from '../../../shared/constants/enums';

interface AssetEntry {
  aspectRatio: string;
  url: string;
}

interface CreateCreativeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function CreateCreativeModal({ isOpen, onClose }: CreateCreativeModalProps) {
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    advertiserId: '',
    type: 'IMAGE',
    titleSmall: '',
    titleMedium: '',
    titleLarge: '',
    subtitleSmall: '',
    subtitleMedium: '',
    subtitleLarge: '',
    bodyText: '',
    ctaText: '',
    ctaUrl: '',
  });

  const [assets, setAssets] = useState<AssetEntry[]>([{ aspectRatio: '1:1', url: '' }]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const updateAsset = (index: number, field: keyof AssetEntry, value: string) => {
    setAssets((prev) => prev.map((a, i) => (i === index ? { ...a, [field]: value } : a)));
  };

  const addAsset = () => {
    setAssets((prev) => [...prev, { aspectRatio: '1:1', url: '' }]);
  };

  const removeAsset = (index: number) => {
    if (assets.length <= 1) return;
    setAssets((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.advertiserId) newErrors.advertiserId = 'Advertiser is required';
    if (!formData.titleSmall.trim()) newErrors.titleSmall = 'Small title is required';
    if (!formData.titleMedium.trim()) newErrors.titleMedium = 'Medium title is required';
    if (!formData.ctaText.trim()) newErrors.ctaText = 'CTA text is required';
    if (formData.ctaText.length > 25) newErrors.ctaText = 'CTA text max 25 characters';
    if (!formData.ctaUrl.trim()) newErrors.ctaUrl = 'CTA URL is required';
    if (assets.every((a) => !a.url.trim())) newErrors.assets = 'At least one asset URL is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = () => {
    if (!validateForm()) {
      toast.show({ content: 'Please fix errors before submitting', color: 'negative', autoDismiss: true });
      return;
    }
    toast.show({
      content: `Creative "${formData.name}" created successfully!`,
      color: 'positive',
      autoDismiss: true,
    });
    resetAndClose();
  };

  const resetAndClose = () => {
    setFormData({
      name: '',
      advertiserId: '',
      type: 'IMAGE',
      titleSmall: '',
      titleMedium: '',
      titleLarge: '',
      subtitleSmall: '',
      subtitleMedium: '',
      subtitleLarge: '',
      bodyText: '',
      ctaText: '',
      ctaUrl: '',
    });
    setAssets([{ aspectRatio: '1:1', url: '' }]);
    setErrors({});
    onClose();
  };

  const selectedAdvertiser = mockAdvertisers.find((a) => a.id === formData.advertiserId);
  const previewAsset = assets.find((a) => a.url.trim());

  return (
    <Modal isOpen={isOpen} onDismiss={resetAndClose} size="full" accessibilityLabel="Create Creative">
      <ModalHeader title="Create Creative" />
      <ModalBody>
        <Box display="flex" justifyContent="center" width="100%" paddingY="spacing.6">
          <Box display="flex" gap="spacing.7" width="100%" maxWidth="1000px" flexDirection={{ base: 'column', l: 'row' }}>
            {/* Left Column - Form */}
            <Box flex={1} display="flex" flexDirection="column" gap="spacing.5">
              <Card>
                <CardHeader>
                  <CardHeaderLeading title="Basic Information" />
                </CardHeader>
                <CardBody>
                  <Box display="flex" flexDirection="column" gap="spacing.5">
                    <TextInput
                      label="Creative Name"
                      placeholder="e.g., Mamaearth Summer Banner"
                      value={formData.name}
                      onChange={({ value }) => updateField('name', value ?? '')}
                      necessityIndicator="required"
                      validationState={errors.name ? 'error' : 'none'}
                      errorText={errors.name}
                    />
                    <Dropdown selectionType="single">
                      <SelectInput
                        label="Advertiser"
                        placeholder="Select advertiser"
                        necessityIndicator="required"
                        onChange={({ values }) => updateField('advertiserId', values[0] ?? '')}
                        validationState={errors.advertiserId ? 'error' : 'none'}
                        errorText={errors.advertiserId}
                      />
                      <DropdownOverlay>
                        <ActionList>
                          {mockAdvertisers
                            .filter((a) => a.status === 'ACTIVE')
                            .map((adv) => (
                              <ActionListItem key={adv.id} title={adv.name} value={adv.id} />
                            ))}
                        </ActionList>
                      </DropdownOverlay>
                    </Dropdown>
                    <RadioGroup
                      label="Creative Type"
                      value={formData.type}
                      onChange={({ value }) => updateField('type', value)}
                      name="creativeType"
                    >
                      {CREATIVE_TYPES.map((t) => (
                        <Radio key={t} value={t}>{t}</Radio>
                      ))}
                    </RadioGroup>
                  </Box>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <CardHeaderLeading title="Assets" suffix={<Badge color="neutral">{String(assets.length)}</Badge>} />
                </CardHeader>
                <CardBody>
                  <Box display="flex" flexDirection="column" gap="spacing.4">
                    {errors.assets && <Alert color="negative" description={errors.assets} isDismissible={false} />}
                    {assets.map((asset, index) => (
                      <Box key={index} display="flex" gap="spacing.3" alignItems="flex-end">
                        <Box width="140px">
                          <Dropdown selectionType="single">
                            <SelectInput
                              label="Ratio"
                              value={asset.aspectRatio}
                              onChange={({ values }) => updateAsset(index, 'aspectRatio', values[0] ?? '1:1')}
                            />
                            <DropdownOverlay>
                              <ActionList>
                                {ASPECT_RATIOS.map((r) => (
                                  <ActionListItem key={r} title={r} value={r} />
                                ))}
                              </ActionList>
                            </DropdownOverlay>
                          </Dropdown>
                        </Box>
                        <Box flexGrow={1}>
                          <TextInput
                            label="Asset URL"
                            placeholder="https://picsum.photos/seed/example/400/400"
                            value={asset.url}
                            onChange={({ value }) => updateAsset(index, 'url', value ?? '')}
                          />
                        </Box>
                        <Tooltip content="Remove asset">
                          <IconButton
                            icon={TrashIcon}
                            size="medium"
                            accessibilityLabel="Remove asset"
                            onClick={() => removeAsset(index)}
                            isDisabled={assets.length <= 1}
                          />
                        </Tooltip>
                      </Box>
                    ))}
                    <Button variant="tertiary" icon={PlusIcon} onClick={addAsset} size="small">
                      Add Asset
                    </Button>
                  </Box>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <CardHeaderLeading title="Copy & Text" />
                </CardHeader>
                <CardBody>
                  <Box display="flex" flexDirection="column" gap="spacing.4">
                    <Heading size="small" marginBottom="spacing.1">Titles</Heading>
                    <TextInput label="Small Title" placeholder="Max ~20 chars" value={formData.titleSmall} onChange={({ value }) => updateField('titleSmall', value ?? '')} necessityIndicator="required" validationState={errors.titleSmall ? 'error' : 'none'} errorText={errors.titleSmall} maxCharacters={20} />
                    <TextInput label="Medium Title" placeholder="Max ~40 chars" value={formData.titleMedium} onChange={({ value }) => updateField('titleMedium', value ?? '')} necessityIndicator="required" validationState={errors.titleMedium ? 'error' : 'none'} errorText={errors.titleMedium} maxCharacters={40} />
                    <TextInput label="Large Title" placeholder="Max ~60 chars" value={formData.titleLarge} onChange={({ value }) => updateField('titleLarge', value ?? '')} maxCharacters={60} />
                    <Divider marginY="spacing.2" />
                    <Heading size="small" marginBottom="spacing.1">Subtitles</Heading>
                    <TextInput label="Small Subtitle" placeholder="Short subtitle" value={formData.subtitleSmall} onChange={({ value }) => updateField('subtitleSmall', value ?? '')} maxCharacters={30} />
                    <TextInput label="Medium Subtitle" placeholder="Medium subtitle" value={formData.subtitleMedium} onChange={({ value }) => updateField('subtitleMedium', value ?? '')} maxCharacters={60} />
                    <TextInput label="Large Subtitle" placeholder="Long subtitle" value={formData.subtitleLarge} onChange={({ value }) => updateField('subtitleLarge', value ?? '')} maxCharacters={100} />
                    <Divider marginY="spacing.2" />
                    <TextArea label="Body Text" placeholder="Main body text for the creative" value={formData.bodyText} onChange={({ value }) => updateField('bodyText', value ?? '')} maxCharacters={200} />
                  </Box>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <CardHeaderLeading title="Call to Action" />
                </CardHeader>
                <CardBody>
                  <Box display="flex" flexDirection="column" gap="spacing.4">
                    <TextInput label="CTA Text" placeholder="e.g., Shop Now" value={formData.ctaText} onChange={({ value }) => updateField('ctaText', value ?? '')} necessityIndicator="required" validationState={errors.ctaText ? 'error' : 'none'} errorText={errors.ctaText} maxCharacters={25} />
                    <TextInput label="CTA URL" placeholder="https://example.com/landing-page" value={formData.ctaUrl} onChange={({ value }) => updateField('ctaUrl', value ?? '')} necessityIndicator="required" validationState={errors.ctaUrl ? 'error' : 'none'} errorText={errors.ctaUrl} />
                  </Box>
                </CardBody>
              </Card>
            </Box>

            {/* Right Column - Live Preview */}
            <Box width={{ base: '100%', l: '340px' }} flexShrink={0} position={{ base: 'relative', l: 'sticky' }} top={{ base: 'spacing.0', l: 'spacing.5' }} alignSelf="flex-start">
              <Card>
                <CardHeader>
                  <CardHeaderLeading title="Live Preview" />
                </CardHeader>
                <CardBody>
                  <Box borderRadius="medium" overflow="hidden" backgroundColor="surface.background.gray.moderate">
                    <Box height="200px" backgroundColor="surface.background.gray.intense" overflow="hidden">
                      {previewAsset?.url ? (
                        <img src={previewAsset.url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      ) : (
                        <Box height="100%" display="flex" alignItems="center" justifyContent="center">
                          <Text color="surface.text.gray.subtle" size="small">Add an asset URL to preview</Text>
                        </Box>
                      )}
                    </Box>
                    <Box padding="spacing.4">
                      {selectedAdvertiser && <Text size="xsmall" color="surface.text.gray.subtle" marginBottom="spacing.2">{selectedAdvertiser.name}</Text>}
                      <Text weight="semibold" size="medium" marginBottom="spacing.2">{formData.titleMedium || formData.titleSmall || 'Creative Title'}</Text>
                      {(formData.subtitleMedium || formData.subtitleSmall) && <Text size="small" color="surface.text.gray.subtle" marginBottom="spacing.2">{formData.subtitleMedium || formData.subtitleSmall}</Text>}
                      {formData.bodyText && <Text size="small" color="surface.text.gray.muted" marginBottom="spacing.3" truncateAfterLines={2}>{formData.bodyText}</Text>}
                      {formData.ctaText && <Button size="small" isFullWidth>{formData.ctaText || 'CTA Button'}</Button>}
                    </Box>
                  </Box>
                  <Divider marginY="spacing.4" />
                  <Box display="flex" flexDirection="column" gap="spacing.2">
                    <Box display="flex" justifyContent="space-between">
                      <Text size="xsmall" color="surface.text.gray.subtle">Type</Text>
                      <Badge color="primary" emphasis="subtle" size="small">{formData.type}</Badge>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Text size="xsmall" color="surface.text.gray.subtle">Assets</Text>
                      <Text size="xsmall">{assets.filter((a) => a.url.trim()).length} uploaded</Text>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Text size="xsmall" color="surface.text.gray.subtle">CTA URL</Text>
                      <Text size="xsmall" truncateAfterLines={1}>{formData.ctaUrl || '—'}</Text>
                    </Box>
                  </Box>
                </CardBody>
              </Card>
            </Box>
          </Box>
        </Box>
      </ModalBody>
      <ModalFooter>
        <Box display="flex" gap="spacing.3" justifyContent="flex-end" width="100%">
          <Button variant="tertiary" onClick={resetAndClose}>Cancel</Button>
          <Button onClick={handleCreate}>Create Creative</Button>
        </Box>
      </ModalFooter>
    </Modal>
  );
}

export default CreateCreativeModal;

