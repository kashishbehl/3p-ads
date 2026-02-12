import React, { useState } from 'react';
import {
  Box,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  TextInput,
  Alert,
  useToast,
  PauseIcon,
  PlayIcon,
  CloseIcon,
} from '@razorpay/blade/components';
import type { Campaign } from '../types';

interface CampaignActionsProps {
  campaign: Campaign;
  onActivate: () => void;
}

function CampaignActions({ campaign, onActivate }: CampaignActionsProps) {
  const toast = useToast();
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const [terminateReason, setTerminateReason] = useState('');
  const [terminateConfirm, setTerminateConfirm] = useState('');

  const handlePause = () => {
    toast.show({ content: `Campaign "${campaign.name}" paused`, color: 'notice', autoDismiss: true });
    setShowPauseModal(false);
  };

  const handleResume = () => {
    toast.show({ content: `Campaign "${campaign.name}" resumed`, color: 'positive', autoDismiss: true });
  };

  const handleTerminate = () => {
    if (terminateReason.length < 10 || terminateConfirm !== 'TERMINATE') return;
    toast.show({ content: `Campaign "${campaign.name}" terminated`, color: 'negative', autoDismiss: true });
    setShowTerminateModal(false);
    setTerminateReason('');
    setTerminateConfirm('');
  };

  return (
    <>
      <Box display="flex" gap="spacing.3">
        {campaign.status === 'DRAFT' && (
          <Button color="positive" onClick={onActivate}>
            Activate
          </Button>
        )}
        {campaign.status === 'ACTIVE' && (
          <Button variant="secondary" icon={PauseIcon} onClick={() => setShowPauseModal(true)}>
            Pause
          </Button>
        )}
        {campaign.status === 'INACTIVE' && (
          <Button color="positive" icon={PlayIcon} onClick={handleResume}>
            Resume
          </Button>
        )}
        {campaign.status !== 'TERMINATED' && (
          <Button variant="secondary" color="negative" icon={CloseIcon} onClick={() => setShowTerminateModal(true)}>
            Terminate
          </Button>
        )}
      </Box>

      {/* Pause Modal */}
      <Modal isOpen={showPauseModal} onDismiss={() => setShowPauseModal(false)} size="small">
        <ModalHeader title="Pause Campaign" subtitle={`Are you sure you want to pause "${campaign.name}"?`} />
        <ModalBody>
          <Alert
            color="notice"
            title="Active Ads"
            description="All active ads in this campaign will be paused."
            isDismissible={false}
          />
        </ModalBody>
        <ModalFooter>
          <Box display="flex" gap="spacing.3" justifyContent="flex-end" width="100%">
            <Button variant="tertiary" onClick={() => setShowPauseModal(false)}>Cancel</Button>
            <Button color="negative" onClick={handlePause}>Pause Campaign</Button>
          </Box>
        </ModalFooter>
      </Modal>

      {/* Terminate Modal */}
      <Modal isOpen={showTerminateModal} onDismiss={() => setShowTerminateModal(false)} size="medium">
        <ModalHeader title="Terminate Campaign" />
        <ModalBody>
          <Box display="flex" flexDirection="column" gap="spacing.4">
            <Alert
              color="negative"
              title="This action is irreversible"
              description="Terminating a campaign will permanently stop all associated ads. This cannot be undone."
              isDismissible={false}
            />
            <TextInput
              label="Reason for termination"
              placeholder="Minimum 10 characters"
              value={terminateReason}
              onChange={({ value }) => setTerminateReason(value ?? '')}
              necessityIndicator="required"
              validationState={terminateReason.length > 0 && terminateReason.length < 10 ? 'error' : 'none'}
              errorText="Reason must be at least 10 characters"
            />
            <TextInput
              label='Type "TERMINATE" to confirm'
              placeholder="TERMINATE"
              value={terminateConfirm}
              onChange={({ value }) => setTerminateConfirm(value ?? '')}
              necessityIndicator="required"
            />
          </Box>
        </ModalBody>
        <ModalFooter>
          <Box display="flex" gap="spacing.3" justifyContent="flex-end" width="100%">
            <Button variant="tertiary" onClick={() => setShowTerminateModal(false)}>Cancel</Button>
            <Button
              color="negative"
              onClick={handleTerminate}
              isDisabled={terminateReason.length < 10 || terminateConfirm !== 'TERMINATE'}
            >
              Terminate Campaign
            </Button>
          </Box>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default CampaignActions;

