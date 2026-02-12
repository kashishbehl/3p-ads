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
  Badge,
  Alert,
  Divider,
  SearchInput,
  UserIcon,
  MailIcon,
  CheckCircleIcon,
} from '@razorpay/blade/components';
import { mockAdvertisers } from '../../../advertisers/mocks/advertisers.mock';
import type { WizardFormData } from '../../hooks/useWizardState';

interface StepAdvertiserProps {
  formData: WizardFormData;
  errors: Record<string, string>;
  updateField: <K extends keyof WizardFormData>(field: K, value: WizardFormData[K]) => void;
}

function StepAdvertiser({ formData, errors, updateField }: StepAdvertiserProps) {
  const activeAdvertisers = mockAdvertisers.filter((a) => a.status === 'ACTIVE');
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredAdvertisers = activeAdvertisers.filter(
    (adv) =>
      !searchQuery ||
      adv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      adv.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAdvertiser = (advId: string) => {
    const adv = mockAdvertisers.find((a) => a.id === advId);
    updateField('advertiserId', advId);
    updateField('advertiserName', adv?.name ?? '');
    updateField('isNewAdvertiser', false);
  };

  const handleSwitchToNew = () => {
    updateField('isNewAdvertiser', true);
    updateField('advertiserId', '');
    updateField('advertiserName', '');
  };

  const handleSwitchToExisting = () => {
    updateField('isNewAdvertiser', false);
    updateField('newAdvertiserName', '');
    updateField('newAdvertiserEmail', '');
    updateField('newAdvertiserMerchantId', '');
    updateField('newAdvertiserWebsite', '');
  };

  return (
    <Box display="flex" justifyContent="center">
      <Box width="100%" maxWidth="640px" display="flex" flexDirection="column" gap="spacing.6">
        <Box>
          <Heading size="large">Select Advertiser</Heading>
          <Text size="small" color="surface.text.gray.subtle" marginTop="spacing.2">
            Choose an existing advertiser or create a new one for this campaign.
          </Text>
        </Box>

        <RadioGroup
          label="Advertiser Source"
          value={formData.isNewAdvertiser ? 'new' : 'existing'}
          onChange={({ value }) => (value === 'new' ? handleSwitchToNew() : handleSwitchToExisting())}
          name="advertiserSource"
        >
          <Radio value="existing">Select existing advertiser</Radio>
          <Radio value="new">Create new advertiser</Radio>
        </RadioGroup>

        {errors.advertiserId && !formData.isNewAdvertiser && (
          <Alert color="negative" description={errors.advertiserId} isDismissible={false} />
        )}

        {!formData.isNewAdvertiser ? (
          <Box display="flex" flexDirection="column" gap="spacing.4">
            <SearchInput
              label="Search Advertisers"
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={({ value }) => setSearchQuery(value ?? '')}
              onClearButtonClick={() => setSearchQuery('')}
            />

            <Box
              display="flex"
              flexDirection="column"
              gap="spacing.3"
              maxHeight="360px"
              overflowY="auto"
            >
              {filteredAdvertisers.map((adv) => {
                const isSelected = formData.advertiserId === adv.id;
                return (
                  <Card
                    key={adv.id}
                    onClick={() => handleSelectAdvertiser(adv.id)}
                    backgroundColor={
                      isSelected ? 'surface.background.primary.subtle' : undefined
                    }
                  >
                    <CardBody>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Box display="flex" alignItems="center" gap="spacing.2">
                            <Text weight="semibold">{adv.name}</Text>
                            {isSelected && (
                              <CheckCircleIcon
                                size="small"
                                color="feedback.icon.positive.intense"
                              />
                            )}
                          </Box>
                          <Text size="xsmall" color="surface.text.gray.muted">
                            {adv.id} · {adv.contactEmail}
                          </Text>
                        </Box>
                        <Box display="flex" gap="spacing.2">
                          <Badge color="neutral" size="small">
                            {adv.activeCampaigns} campaigns
                          </Badge>
                        </Box>
                      </Box>
                    </CardBody>
                  </Card>
                );
              })}
              {filteredAdvertisers.length === 0 && (
                <Text color="surface.text.gray.subtle" textAlign="center">
                  No advertisers found matching your search.
                </Text>
              )}
            </Box>
          </Box>
        ) : (
          <Card>
            <CardHeader>
              <CardHeaderLeading title="New Advertiser Details" />
            </CardHeader>
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.5">
                <TextInput
                  label="Advertiser Name"
                  placeholder="e.g., Mamaearth"
                  value={formData.newAdvertiserName}
                  onChange={({ value }) => updateField('newAdvertiserName', value ?? '')}
                  necessityIndicator="required"
                  validationState={errors.newAdvertiserName ? 'error' : 'none'}
                  errorText={errors.newAdvertiserName}
                  leadingIcon={UserIcon}
                />
                <TextInput
                  label="Contact Email"
                  placeholder="e.g., ads@company.com"
                  type="email"
                  value={formData.newAdvertiserEmail}
                  onChange={({ value }) => updateField('newAdvertiserEmail', value ?? '')}
                  necessityIndicator="required"
                  validationState={errors.newAdvertiserEmail ? 'error' : 'none'}
                  errorText={errors.newAdvertiserEmail}
                  leadingIcon={MailIcon}
                />
                <Divider />
                <TextInput
                  label="Merchant ID"
                  placeholder="e.g., merchant_xxx (18 chars)"
                  value={formData.newAdvertiserMerchantId}
                  onChange={({ value }) => updateField('newAdvertiserMerchantId', value ?? '')}
                  helpText="Optional. 18-character merchant identifier"
                  maxCharacters={18}
                />
                <TextInput
                  label="Website URL"
                  placeholder="https://www.example.com"
                  type="url"
                  value={formData.newAdvertiserWebsite}
                  onChange={({ value }) => updateField('newAdvertiserWebsite', value ?? '')}
                />
              </Box>
            </CardBody>
          </Card>
        )}
      </Box>
    </Box>
  );
}

export default StepAdvertiser;

