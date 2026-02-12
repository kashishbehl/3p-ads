import React from 'react';
import {
  Box,
  Heading,
  Text,
  Card,
  CardBody,
  CardHeader,
  CardHeaderLeading,
  TextInput,
  RadioGroup,
  Radio,
  Button,
  Badge,
  Alert,
  IconButton,
  Tooltip,
  Divider,
  PlusIcon,
  TrashIcon,
} from '@razorpay/blade/components';
import { AD_TYPES } from '../../../../shared/constants/enums';
import type { WizardFormData, WizardAdEntry } from '../../hooks/useWizardState';

interface StepAddAdsProps {
  formData: WizardFormData;
  errors: Record<string, string>;
  updateAds: (ads: WizardAdEntry[]) => void;
}

function StepAddAds({ formData, errors, updateAds }: StepAddAdsProps) {
  const addAd = () => {
    const newAd: WizardAdEntry = {
      id: `wizard_ad_${Date.now()}`,
      name: '',
      type: 'BANNER',
      rewardId: '',
      mappedCreativeIds: [],
    };
    updateAds([...formData.ads, newAd]);
  };

  const removeAd = (index: number) => {
    updateAds(formData.ads.filter((_, i) => i !== index));
  };

  const updateAd = (index: number, field: keyof WizardAdEntry, value: string) => {
    const updated = formData.ads.map((ad, i) =>
      i === index ? { ...ad, [field]: value } : ad
    );
    updateAds(updated);
  };

  return (
    <Box display="flex" justifyContent="center">
      <Box width="100%" maxWidth="640px" display="flex" flexDirection="column" gap="spacing.6">
        <Box>
          <Heading size="large">Add Ads</Heading>
          <Text size="small" color="surface.text.gray.subtle" marginTop="spacing.2">
            Create one or more ads for this campaign. Each ad can be a Banner or Scratch Card.
          </Text>
        </Box>

        {errors.ads && (
          <Alert color="negative" description={errors.ads} isDismissible={false} />
        )}

        {formData.ads.length === 0 && (
          <Card>
            <CardBody>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap="spacing.4"
                padding="spacing.6"
              >
                <Text color="surface.text.gray.subtle">
                  No ads added yet. Add at least one ad for this campaign.
                </Text>
                <Button icon={PlusIcon} onClick={addAd}>
                  Add First Ad
                </Button>
              </Box>
            </CardBody>
          </Card>
        )}

        {formData.ads.map((ad, index) => (
          <Card key={ad.id}>
            <CardHeader>
              <CardHeaderLeading
                title={`Ad ${index + 1}`}
                subtitle={ad.name || 'Untitled ad'}
                suffix={
                  <Box display="flex" gap="spacing.2" alignItems="center">
                    <Badge color={ad.type === 'SCRATCH_CARD' ? 'notice' : 'primary'} size="small">
                      {ad.type}
                    </Badge>
                    <Tooltip content="Remove ad">
                      <IconButton
                        icon={TrashIcon}
                        size="small"
                        accessibilityLabel="Remove ad"
                        onClick={() => removeAd(index)}
                      />
                    </Tooltip>
                  </Box>
                }
              />
            </CardHeader>
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.5">
                <TextInput
                  label="Ad Name"
                  placeholder={`e.g., ${formData.campaignName || 'Campaign'} Banner Ad`}
                  value={ad.name}
                  onChange={({ value }) => updateAd(index, 'name', value ?? '')}
                  necessityIndicator="required"
                  validationState={errors[`ad_${index}_name`] ? 'error' : 'none'}
                  errorText={errors[`ad_${index}_name`]}
                />
                <RadioGroup
                  label="Ad Type"
                  value={ad.type}
                  onChange={({ value }) => updateAd(index, 'type', value as 'BANNER' | 'SCRATCH_CARD')}
                  name={`adType_${index}`}
                >
                  {AD_TYPES.map((t) => (
                    <Radio
                      key={t}
                      value={t}
                      helpText={t === 'SCRATCH_CARD' ? 'Requires Reward ID' : 'Standard display ad'}
                    >
                      {t.replace('_', ' ')}
                    </Radio>
                  ))}
                </RadioGroup>
                {ad.type === 'SCRATCH_CARD' && (
                  <TextInput
                    label="Reward ID"
                    placeholder="21-character reward identifier"
                    value={ad.rewardId}
                    onChange={({ value }) => updateAd(index, 'rewardId', value ?? '')}
                    necessityIndicator="required"
                    validationState={errors[`ad_${index}_rewardId`] ? 'error' : 'none'}
                    errorText={errors[`ad_${index}_rewardId`]}
                    maxCharacters={21}
                    helpText="Unique reward ID for the scratch card (exactly 21 characters)"
                  />
                )}
              </Box>
            </CardBody>
          </Card>
        ))}

        {formData.ads.length > 0 && (
          <Button variant="secondary" icon={PlusIcon} onClick={addAd}>
            Add Another Ad
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default StepAddAds;

