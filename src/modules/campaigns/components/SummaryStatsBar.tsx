import React from 'react';
import {
  Box,
  Card,
  CardBody,
  Text,
  Heading,
  Amount,
} from '@razorpay/blade/components';
import type { Campaign } from '../types';

interface SummaryStatsBarProps {
  campaigns: Campaign[];
}

function SummaryStatsBar({ campaigns }: SummaryStatsBarProps) {
  const stats = {
    total: campaigns.length,
    active: campaigns.filter((c) => c.status === 'ACTIVE').length,
    draft: campaigns.filter((c) => c.status === 'DRAFT').length,
    totalBudget: campaigns.reduce((sum, c) => sum + c.totalBudget, 0),
  };

  const cards = [
    { label: 'Total Campaigns', value: stats.total, color: 'surface.text.gray.normal' },
    { label: 'Active', value: stats.active, color: 'feedback.text.positive.intense' },
    { label: 'Draft', value: stats.draft, color: 'feedback.text.information.intense' },
  ];

  return (
    <Box display="flex" gap="spacing.4" marginBottom="spacing.6" flexWrap="wrap">
      {cards.map((card) => (
        <Card key={card.label} padding="spacing.5" width={{ base: '48%', s: 'auto' }} flex={{ s: '1' }} minWidth={{ s: '140px' }}>
          <CardBody>
            <Text size="small" color="surface.text.gray.subtle" marginBottom="spacing.2">
              {card.label}
            </Text>
            <Heading size="xlarge" color={card.color}>
              {String(card.value)}
            </Heading>
          </CardBody>
        </Card>
      ))}
      <Card padding="spacing.5" width={{ base: '100%', s: 'auto' }} flex={{ s: '1' }} minWidth={{ s: '180px' }}>
        <CardBody>
          <Text size="small" color="surface.text.gray.subtle" marginBottom="spacing.2">
            Budget Allocated
          </Text>
          <Amount
            value={stats.totalBudget / 100}
            type="heading"
            size="large"
            weight="semibold"
            currency="INR"
            suffix="humanize"
          />
        </CardBody>
      </Card>
    </Box>
  );
}

export default SummaryStatsBar;

