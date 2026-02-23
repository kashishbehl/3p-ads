import { Link } from 'react-router-dom';
import {
  SideNav,
  SideNavBody,
  SideNavSection,
  SideNavLink,
  Box,
  Text,
  RazorpayIcon,
  AnnouncementIcon,
} from '@razorpay/blade/components';

function Sidebar() {
  return (
    <SideNav position="fixed">
      <SideNavBody>
        <SideNavSection>
          <Box
            display="flex"
            alignItems="center"
            gap="spacing.3"
            paddingX="spacing.4"
            paddingY="spacing.3"
            marginBottom="spacing.2"
          >
            <RazorpayIcon size="large" color="interactive.icon.primary.normal" />
            <Text size="medium" weight="semibold" color="surface.text.gray.normal">
              Razorpay
            </Text>
          </Box>
        </SideNavSection>
        <SideNavSection>
          <SideNavLink
            icon={AnnouncementIcon}
            title="3P Ad Network"
            href="/admin"
            as={Link}
            isActive={true}
          />
        </SideNavSection>
      </SideNavBody>
    </SideNav>
  );
}

export default Sidebar;
