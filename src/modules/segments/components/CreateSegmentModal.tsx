import React, { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Box,
  Button,
  TextInput,
  RadioGroup,
  Radio,
  useToast,
} from '@razorpay/blade/components';

interface CreateSegmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function CreateSegmentModal({ isOpen, onClose }: CreateSegmentModalProps) {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'retail',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    toast.show({
      content: `Segment "${formData.name}" created successfully!`,
      color: 'positive',
      autoDismiss: true,
    });
    onClose();
    setFormData({ name: '', description: '', category: 'retail' });
    setErrors({});
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const resetAndClose = () => {
    setFormData({ name: '', description: '', category: 'retail' });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onDismiss={resetAndClose} size="medium" accessibilityLabel="Create Segment">
      <ModalHeader title="Create New Segment" />
      <ModalBody>
        <Box display="flex" flexDirection="column" gap="spacing.5" padding="spacing.4">
          <TextInput
            label="Segment Name"
            placeholder="e.g., Fashion"
            value={formData.name}
            onChange={({ value }) => updateField('name', value ?? '')}
            necessityIndicator="required"
            validationState={errors.name ? 'error' : 'none'}
            errorText={errors.name}
          />
          <TextInput
            label="Description"
            placeholder="Brief description of this segment"
            value={formData.description}
            onChange={({ value }) => updateField('description', value ?? '')}
            maxCharacters={200}
          />
          <RadioGroup
            label="Category"
            value={formData.category}
            onChange={({ value }) => updateField('category', value)}
            name="category"
            necessityIndicator="required"
            validationState={errors.category ? 'error' : 'none'}
            errorText={errors.category}
          >
            <Radio value="retail" helpText="Standard retail and e-commerce segments">
              Retail
            </Radio>
            <Radio value="restricted" helpText="Age-restricted or regulated categories">
              Restricted
            </Radio>
          </RadioGroup>
        </Box>
      </ModalBody>
      <ModalFooter>
        <Box display="flex" gap="spacing.3" justifyContent="flex-end" width="100%">
          <Button variant="tertiary" onClick={resetAndClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Segment</Button>
        </Box>
      </ModalFooter>
    </Modal>
  );
}

export default CreateSegmentModal;
