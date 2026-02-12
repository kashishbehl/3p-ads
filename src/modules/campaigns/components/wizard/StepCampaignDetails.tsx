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
  Alert,
  Badge,
  Divider,
} from '@razorpay/blade/components';
import { PRICING_MODELS, PACING_TYPES } from '../../../../shared/constants/enums';
import { formatCurrency } from '../../../../shared/utils/formatters';
import type { WizardFormData } from '../../hooks/useWizardState';

interface StepCampaignDetailsProps {
  formData: WizardFormData;
  errors: Record<string, string>;
  updateField: <K extends keyof WizardFormData>(field: K, value: WizardFormData[K]) => void;
}

function StepCampaignDetails({ formData, errors, updateField }: StepCampaignDetailsProps) {
  const dailyBudgetWarning =
    formData.dailyBudget &&
    formData.totalBudget &&
    Number(formData.dailyBudget) > Number(formData.totalBudget) / 30;

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
                label="Priority (1-10)"
                placeholder="5"
                type="number"
                value={formData.priority}
                onChange={({ value }) => updateField('priority', value ?? '')}
                helpText="1 = lowest, 10 = highest"
              />
            </Box>
          </CardBody>
        </Card>

        {/* Budget & Pricing */}
        <Card>
          <CardHeader>
            <CardHeaderLeading title="Budget & Pricing" />
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
                label="Price Value (in paisa)"
                placeholder="e.g., 1500"
                type="number"
                value={formData.priceValue}
                onChange={({ value }) => updateField('priceValue', value ?? '')}
                necessityIndicator="required"
                validationState={errors.priceValue ? 'error' : 'none'}
                errorText={errors.priceValue}
                helpText={
                  formData.priceValue
                    ? `= ${formatCurrency(Number(formData.priceValue))}`
                    : 'Enter amount in paisa'
                }
              />
              <Divider />
              <TextInput
                label="Total Budget (in paisa)"
                placeholder="e.g., 50000000"
                type="number"
                value={formData.totalBudget}
                onChange={({ value }) => updateField('totalBudget', value ?? '')}
                necessityIndicator="required"
                validationState={errors.totalBudget ? 'error' : 'none'}
                errorText={errors.totalBudget}
                helpText={formData.totalBudget ? `= ${formatCurrency(Number(formData.totalBudget))}` : ''}
              />
              <TextInput
                label="Daily Budget (in paisa)"
                placeholder="e.g., 1500000"
                type="number"
                value={formData.dailyBudget}
                onChange={({ value }) => updateField('dailyBudget', value ?? '')}
                necessityIndicator="required"
                validationState={errors.dailyBudget ? 'error' : 'none'}
                errorText={errors.dailyBudget}
                helpText={formData.dailyBudget ? `= ${formatCurrency(Number(formData.dailyBudget))}` : ''}
              />
              {dailyBudgetWarning && (
                <Alert
                  color="notice"
                  title="Budget Warning"
                  description="Daily budget exceeds total budget / 30 days. This may exhaust the budget quickly."
                  isDismissible={false}
                />
              )}
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
      </Box>
    </Box>
  );
}

export default StepCampaignDetails;

