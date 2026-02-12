import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardHeaderLeading,
  CardHeaderIcon,
  Code,
  Link,
  IconButton,
  Tooltip,
  Divider,
  useToast,
  ArrowLeftIcon,
  CopyIcon,
  ImageIcon,
  LinkIcon,
} from '@razorpay/blade/components';
import { mockCreatives } from '../../creatives/mocks/creatives.mock';
import { formatDate, copyToClipboard } from '../../../shared/utils/formatters';

function CreativeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const creative = mockCreatives.find((c) => c.id === id);

  if (!creative) {
    return (
      <Box padding="spacing.7" display="flex" flexDirection="column" alignItems="center" gap="spacing.4">
        <Heading size="large">Creative Not Found</Heading>
        <Button variant="secondary" icon={ArrowLeftIcon} onClick={() => navigate('/admin/library/creatives')}>
          Back to Creatives
        </Button>
      </Box>
    );
  }

  const handleCopyId = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      toast.show({ content: `Copied ${text}`, color: 'positive', autoDismiss: true });
    }
  };

  return (
    <Box>
      <Button
        variant="tertiary"
        icon={ArrowLeftIcon}
        onClick={() => navigate('/admin/library/creatives')}
        marginBottom="spacing.4"
      >
        Back to Creatives
      </Button>

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginBottom="spacing.6" flexWrap="wrap" gap="spacing.4">
        <Box>
          <Heading size="xlarge" marginBottom="spacing.2">{creative.name}</Heading>
          <Box display="flex" alignItems="center" gap="spacing.2">
            <Code size="small">{creative.id}</Code>
            <Tooltip content="Copy ID">
              <IconButton icon={CopyIcon} size="small" accessibilityLabel="Copy ID" onClick={() => handleCopyId(creative.id)} />
            </Tooltip>
            <Text size="small" color="surface.text.gray.subtle">•</Text>
            <Link variant="button" size="small" onClick={() => navigate(`/admin/library/advertisers/${creative.advertiserId}`)}>
              {creative.advertiserName}
            </Link>
          </Box>
        </Box>
        <Box display="flex" gap="spacing.3" alignItems="center">
          <Badge color="primary" emphasis="subtle">{creative.type}</Badge>
          <Badge color={creative.usedInAds > 0 ? 'positive' : 'neutral'}>
            Used in {creative.usedInAds} ads
          </Badge>
        </Box>
      </Box>

      <Box display="flex" gap="spacing.5" flexWrap="wrap">
        {/* Assets */}
        <Card flex={1} minWidth="320px">
          <CardHeader>
            <CardHeaderLeading
              title="Assets"
              subtitle={`${creative.assets.length} asset(s)`}
              prefix={<CardHeaderIcon icon={ImageIcon} />}
            />
          </CardHeader>
          <CardBody>
            <Box display="flex" gap="spacing.4" flexWrap="wrap">
              {creative.assets.map((asset, index) => (
                <Box key={index} display="flex" flexDirection="column" gap="spacing.2">
                  <Box
                    width="200px"
                    height="150px"
                    backgroundColor="surface.background.gray.moderate"
                    borderRadius="medium"
                    overflow="hidden"
                  >
                    <img
                      src={asset.url}
                      alt={`Asset ${index + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                  <Badge color="neutral">{asset.aspectRatio}</Badge>
                </Box>
              ))}
            </Box>
          </CardBody>
        </Card>

        {/* Copy & CTA */}
        <Card flex={1} minWidth="320px">
          <CardHeader>
            <CardHeaderLeading
              title="Copy & Call to Action"
              prefix={<CardHeaderIcon icon={LinkIcon} />}
            />
          </CardHeader>
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.4">
              <Box>
                <Text size="small" color="surface.text.gray.subtle">Titles</Text>
                <Text weight="semibold">{creative.title?.small || '—'}</Text>
                {creative.title?.medium && <Text>{creative.title.medium}</Text>}
                {creative.title?.large && <Text color="surface.text.gray.subtle">{creative.title.large}</Text>}
              </Box>
              <Divider />
              {(creative.subtitle?.small || creative.subtitle?.medium) && (
                <>
                  <Box>
                    <Text size="small" color="surface.text.gray.subtle">Subtitles</Text>
                    <Text>{creative.subtitle?.small || creative.subtitle?.medium || '—'}</Text>
                  </Box>
                  <Divider />
                </>
              )}
              {creative.bodyText && (
                <>
                  <Box>
                    <Text size="small" color="surface.text.gray.subtle">Body Text</Text>
                    <Text>{creative.bodyText}</Text>
                  </Box>
                  <Divider />
                </>
              )}
              <Box>
                <Text size="small" color="surface.text.gray.subtle">CTA</Text>
                <Text weight="semibold">{creative.ctaText}</Text>
                <Link href={creative.ctaUrl} target="_blank" size="small">
                  {creative.ctaUrl}
                </Link>
              </Box>
              <Box>
                <Text size="small" color="surface.text.gray.subtle">Created</Text>
                <Text>{formatDate(creative.createdAt)}</Text>
              </Box>
            </Box>
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
}

export default CreativeDetail;

