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
  Alert,
  Badge,
  Dropdown,
  DropdownOverlay,
  SelectInput,
  ActionList,
  ActionListItem,
} from '@razorpay/blade/components';
import { PRICING_MODELS, PACING_TYPES } from '../../../../shared/constants/enums';
import { PUBLISHERS } from '../../../../shared/constants/publishers';
import { paisaToRupees, rupeesToPaisa } from '../../../../shared/utils/formatters';
import type { WizardFormData } from '../../hooks/useWizardState';

interface StepCampaignDetailsProps {
  formData: WizardFormData;
  errors: Record<string, string>;
  updateField: <K extends keyof WizardFormData>(field: K, value: WizardFormData[K]) => void;
}

function StepCampaignDetails({ formData, errors, updateField }: StepCampaignDetailsProps) {
  return (
    <Box display="flex" justifyContent="center">
      <Box width="100%" maxWidth="640px" display="flex" flexDirection="column" gap="spacing.6">
        <Box>
          <Heading size="large">Campaign Details</Heading>
          <Text size="small" color="surface.text.gray.subtle" marginTop="spacing.2">
            Configure the campaign name, budget, pricing model, and schedule.
          </Text>
        </Box>

        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardHeaderLeading title="Basic Information" />
          </CardHeader>
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.5">
              <TextInput
                label="Campaign Name"
                placeholder="e.g., Summer Sale 2026"
                value={formData.campaignName}
                onChange={({ value }) => updateField('campaignName', value ?? '')}
                necessityIndicator="required"
                validationState={errors.campaignName ? 'error' : 'none'}
                errorText={errors.campaignName}
              />
              <RadioGroup
                label="Campaign Type"
                value={formData.campaignType}
                onChange={({ value }) => updateField('campaignType', value)}
                name="campaignType"
              >
                <Radio value="PERFORMANCE" helpText="Optimize for conversions (CPC, CPA, ROAS)">
                  Performance
                </Radio>
                <Radio value="BRANDING" helpText="Optimize for visibility (CPM)">
                  Branding
                </Radio>
              </RadioGroup>
              <TextInput
                label="Description"
                placeholder="Brief description of this campaign"
                value={formData.description}
                onChange={({ value }) => updateField('description', value ?? '')}
                maxCharacters={500}
              />
              <TextInput
                label="Priority Level"
                placeholder="5"
                type="number"
                value={formData.priority}
                onChange={({ value }) => updateField('priority', value ?? '')}
                helpText="1 = highest priority, 10 = lowest priority"
              />
            </Box>
          </CardBody>
        </Card>

        {/* Pricing Model */}
        <Card>
          <CardHeader>
            <CardHeaderLeading title="Pricing Model" />
          </CardHeader>
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.5">
              <RadioGroup
                label="Pricing Model"
                value={formData.pricingModel}
                onChange={({ value }) => updateField('pricingModel', value)}
                name="pricingModel"
              >
                {PRICING_MODELS.map((model) => (
                  <Radio key={model} value={model}>
                    {model}
                  </Radio>
                ))}
              </RadioGroup>
              <TextInput
                label="Price Value (₹)"
                placeholder="e.g., 15"
                type="number"
                value={formData.priceValue ? String(paisaToRupees(Number(formData.priceValue))) : ''}
                onChange={({ value }) => updateField('priceValue', value ? String(rupeesToPaisa(Number(value))) : '')}
                necessityIndicator="required"
                validationState={errors.priceValue ? 'error' : 'none'}
                errorText={errors.priceValue}
                helpText="Enter price in rupees"
              />
            </Box>
          </CardBody>
        </Card>

        {/* Budget and Pacing */}
        <Card>
          <CardHeader>
            <CardHeaderLeading title="Budget and Pacing" />
          </CardHeader>
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.5">
              <TextInput
                label="Total Budget (₹)"
                placeholder="e.g., 500000"
                type="number"
                value={formData.totalBudget ? String(paisaToRupees(Number(formData.totalBudget))) : ''}
                onChange={({ value }) => updateField('totalBudget', value ? String(rupeesToPaisa(Number(value))) : '')}
                necessityIndicator="required"
                validationState={errors.totalBudget ? 'error' : 'none'}
                errorText={errors.totalBudget}
                helpText="Enter total campaign budget in rupees"
              />
              <TextInput
                label="Daily Budget (₹)"
                placeholder="e.g., 15000"
                type="number"
                value={formData.dailyBudget ? String(paisaToRupees(Number(formData.dailyBudget))) : ''}
                onChange={({ value }) => updateField('dailyBudget', value ? String(rupeesToPaisa(Number(value))) : '')}
                necessityIndicator="required"
                validationState={errors.dailyBudget ? 'error' : 'none'}
                errorText={errors.dailyBudget}
                helpText="Enter daily spending limit in rupees"
              />
              <RadioGroup
                label="Pacing"
                value={formData.pacing}
                onChange={({ value }) => updateField('pacing', value)}
                name="pacing"
              >
                {PACING_TYPES.map((p) => (
                  <Radio key={p} value={p}>
                    {p}
                  </Radio>
                ))}
              </RadioGroup>
            </Box>
          </CardBody>
        </Card>

        {/* Schedule */}
        <Card>
          <CardHeader>
            <CardHeaderLeading title="Schedule" />
          </CardHeader>
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.5">
              <TextInput
                label="Start Date"
                placeholder="YYYY-MM-DD"
                value={formData.startDate}
                onChange={({ value }) => updateField('startDate', value ?? '')}
                helpText="ISO format: YYYY-MM-DD"
              />
              <TextInput
                label="End Date"
                placeholder="YYYY-MM-DD"
                value={formData.endDate}
                onChange={({ value }) => updateField('endDate', value ?? '')}
                helpText="ISO format: YYYY-MM-DD"
              />
              {formData.startDate && formData.endDate && (
                <Box
                  padding="spacing.4"
                  backgroundColor="surface.background.gray.moderate"
                  borderRadius="medium"
                >
                  <Text size="small" color="surface.text.gray.subtle">
                    Campaign Duration
                  </Text>
                  <Text weight="semibold">
                    {Math.max(
                      0,
                      Math.ceil(
                        (new Date(formData.endDate).getTime() -
                          new Date(formData.startDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )
                    )}{' '}
                    days
                  </Text>
                </Box>
              )}
            </Box>
          </CardBody>
        </Card>

        {/* Segment Targeting */}
        <Card>
          <CardHeader>
            <CardHeaderLeading title="Segment Targeting (Optional)" />
          </CardHeader>
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.5">
              <Alert
                color="information"
                description="If no segment is added, ad will be shown to everyone"
                isDismissible={false}
              />
              <TextInput
                label="Whitelist Segments"
                placeholder="fashion, beauty, lifestyle"
                value={formData.segmentWhitelist}
                onChange={({ value }) => updateField('segmentWhitelist', value ?? '')}
                helpText="Comma-separated segment names to target"
              />
              <TextInput
                label="Blacklist Segments"
                placeholder="gambling, alcohol"
                value={formData.segmentBlacklist}
                onChange={({ value }) => updateField('segmentBlacklist', value ?? '')}
                helpText="Comma-separated segment names to exclude"
              />
            </Box>
          </CardBody>
        </Card>

        {/* Publishers */}
        <Card>
          <CardHeader>
            <CardHeaderLeading title="Publishers (Optional)" />
          </CardHeader>
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.5">
              <Dropdown selectionType="multiple">
                <SelectInput
                  label="Publishers"
                  placeholder="Select publishers (leave empty for all)"
                  value={formData.publisherIds}
                  onChange={({ values }) => updateField('publisherIds', values ?? [])}
                  helpText="Choose where this campaign should appear"
                />
                <DropdownOverlay>
                  <ActionList>
                    {PUBLISHERS.map((publisher) => (
                      <ActionListItem key={publisher.id} title={publisher.name} value={publisher.id} />
                    ))}
                  </ActionList>
                </DropdownOverlay>
              </Dropdown>
            </Box>
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
}

export default StepCampaignDetails;

