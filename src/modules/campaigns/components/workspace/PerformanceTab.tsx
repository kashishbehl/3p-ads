import React from 'react';
import {
  Box,
  Heading,
  Text,
  Card,
  CardBody,
  Badge,
} from '@razorpay/blade/components';

function PerformanceTab() {
  return (
    <Box paddingTop="spacing.5" display="flex" flexDirection="column" alignItems="center" padding="spacing.7">
      <Card width="100%" maxWidth="500px">
        <CardBody>
          <Box display="flex" flexDirection="column" alignItems="center" gap="spacing.4" padding="spacing.5">
            <Badge color="notice">Coming Soon</Badge>
            <Heading size="medium" color="surface.text.gray.subtle">
              Performance Analytics
            </Heading>
            <Text color="surface.text.gray.subtle" textAlign="center">
              Performance metrics, impression data, click-through rates, and conversion analytics
              will be available here in Phase 2.
            </Text>
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
}

export default PerformanceTab;

