import React, { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Box,
  Button,
  TextInput,
  Heading,
  Text,
  Divider,
  useToast,
  UserIcon,
  MailIcon,
} from '@razorpay/blade/components';
import { useNavigate } from 'react-router-dom';

interface CreateAdvertiserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function CreateAdvertiserModal({ isOpen, onClose }: CreateAdvertiserModalProps) {
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    contactEmail: '',
    merchantId: '',
    websiteUrl: '',
    contactPhone: '',
    programId: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail))
      newErrors.contactEmail = 'Invalid email format';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    toast.show({
      content: `Advertiser "${formData.name}" created successfully!`,
      color: 'positive',
      autoDismiss: true,
      action: {
        text: 'Create Campaign',
        onClick: ({ toastId }) => {
          toast.dismiss(toastId);
          navigate('/admin/campaigns/create');
        },
      },
    });
    onClose();
    setFormData({ name: '', contactEmail: '', merchantId: '', websiteUrl: '', contactPhone: '', programId: '' });
    setErrors({});
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const resetAndClose = () => {
    setFormData({ name: '', contactEmail: '', merchantId: '', websiteUrl: '', contactPhone: '', programId: '' });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onDismiss={resetAndClose} size="full" accessibilityLabel="Create Advertiser">
      <ModalHeader title="Create New Advertiser" />
      <ModalBody>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="flex-start"
          width="100%"
          paddingY="spacing.6"
        >
          <Box width="100%" maxWidth="560px" display="flex" flexDirection="column" gap="spacing.6">
            <Box>
              <Heading size="medium" marginBottom="spacing.2">
                Basic Information
              </Heading>
              <Text size="small" color="surface.text.gray.muted">
                Enter the core details for this advertiser
              </Text>
            </Box>
            <Divider />
            <Box display="flex" flexDirection="column" gap="spacing.5">
              <TextInput
                label="Advertiser Name"
                placeholder="e.g., Mamaearth"
                value={formData.name}
                onChange={({ value }) => updateField('name', value ?? '')}
                necessityIndicator="required"
                validationState={errors.name ? 'error' : 'none'}
                errorText={errors.name}
                leadingIcon={UserIcon}
              />
              <TextInput
                label="Contact Email"
                placeholder="e.g., ads@company.com"
                type="email"
                value={formData.contactEmail}
                onChange={({ value }) => updateField('contactEmail', value ?? '')}
                necessityIndicator="required"
                validationState={errors.contactEmail ? 'error' : 'none'}
                errorText={errors.contactEmail}
                leadingIcon={MailIcon}
              />
              <TextInput
                label="Merchant ID"
                placeholder="e.g., merchant_xxx (18 chars)"
                value={formData.merchantId}
                onChange={({ value }) => updateField('merchantId', value ?? '')}
                helpText="Optional. 18-character merchant identifier"
                maxCharacters={18}
              />
            </Box>

            <Divider />

            <Box>
              <Heading size="medium" marginBottom="spacing.2">
                Additional Details
              </Heading>
              <Text size="small" color="surface.text.gray.muted">
                Optional fields for extra configuration
              </Text>
            </Box>
            <Box display="flex" flexDirection="column" gap="spacing.5">
              <TextInput
                label="Website URL"
                placeholder="https://www.example.com"
                type="url"
                value={formData.websiteUrl}
                onChange={({ value }) => updateField('websiteUrl', value ?? '')}
              />
              <TextInput
                label="Contact Phone"
                placeholder="+91XXXXXXXXXX"
                type="telephone"
                value={formData.contactPhone}
                onChange={({ value }) => updateField('contactPhone', value ?? '')}
              />
              <TextInput
                label="Program ID"
                placeholder="22-character program ID"
                value={formData.programId}
                onChange={({ value }) => updateField('programId', value ?? '')}
                maxCharacters={22}
              />
            </Box>
          </Box>
        </Box>
      </ModalBody>
      <ModalFooter>
        <Box display="flex" gap="spacing.3" justifyContent="flex-end" width="100%">
          <Button variant="tertiary" onClick={resetAndClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Advertiser</Button>
        </Box>
      </ModalFooter>
    </Modal>
  );
}

export default CreateAdvertiserModal;

