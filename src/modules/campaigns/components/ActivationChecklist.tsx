import React from 'react';
import {
  Box,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
  Badge,
  ProgressBar,
  Alert,
  useToast,
  CheckCircleIcon,
  CloseIcon,
} from '@razorpay/blade/components';
import type { Campaign } from '../types';
import { useCampaignReadiness } from '../hooks/useCampaignReadiness';

interface ActivationChecklistProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign;
}

function ActivationChecklist({ isOpen, onClose, campaign }: ActivationChecklistProps) {
  const toast = useToast();
  const readiness = useCampaignReadiness(campaign);

  const handleActivate = () => {
    if (!readiness.isReady) {
      toast.show({
        content: 'Campaign is not ready for activation. Complete all checklist items.',
        color: 'negative',
        autoDismiss: true,
      });
      return;
    }
    toast.show({
      content: `Campaign "${campaign.name}" activated successfully!`,
      color: 'positive',
      autoDismiss: true,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onDismiss={onClose} size="medium" accessibilityLabel="Activation Checklist">
      <ModalHeader
        title="Activation Checklist"
        subtitle={`Review requirements before activating "${campaign.name}"`}
      />
      <ModalBody>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <ProgressBar
            label="Overall Readiness"
            value={readiness.percentage}
            showPercentage
            accessibilityLabel={`Readiness: ${readiness.percentage}%`}
          />

          <Box display="flex" flexDirection="column" gap="spacing.3">
            {readiness.checks.map((check) => (
              <Box
                key={check.label}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                padding="spacing.3"
                backgroundColor={
                  check.passed
                    ? 'surface.background.primary.subtle'
                    : 'surface.background.gray.moderate'
                }
                borderRadius="medium"
              >
                <Box display="flex" alignItems="center" gap="spacing.3">
                  {check.passed ? (
                    <CheckCircleIcon size="small" color="feedback.icon.positive.intense" />
                  ) : (
                    <CloseIcon size="small" color="feedback.icon.negative.intense" />
                  )}
                  <Box>
                    <Text size="small" weight="semibold">{check.label}</Text>
                    <Text size="xsmall" color="surface.text.gray.muted">{check.description}</Text>
                  </Box>
                </Box>
                <Badge color={check.passed ? 'positive' : 'negative'} size="small">
                  {check.passed ? 'Ready' : 'Incomplete'}
                </Badge>
              </Box>
            ))}
          </Box>

          {!readiness.isReady && (
            <Alert
              color="notice"
              title="Not Ready"
              description="Complete all checklist items before activating this campaign."
              isDismissible={false}
            />
          )}
        </Box>
      </ModalBody>
      <ModalFooter>
        <Box display="flex" gap="spacing.3" justifyContent="flex-end" width="100%">
          <Button variant="tertiary" onClick={onClose}>Cancel</Button>
          <Button
            color="positive"
            onClick={handleActivate}
            isDisabled={!readiness.isReady}
          >
            Activate Campaign
          </Button>
        </Box>
      </ModalFooter>
    </Modal>
  );
}

export default ActivationChecklist;

