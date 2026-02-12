import React from 'react';
import { Link, useLocation, matchPath } from 'react-router-dom';
import {
  SideNav,
  SideNavBody,
  SideNavSection,
  SideNavLink,
  Box,
  Text,
  HomeIcon,
  AnnouncementIcon,
  UsersIcon,
  ImageIcon,
  RazorpayIcon,
} from '@razorpay/blade/components';

const isItemActive = (
  location: { pathname: string },
  { href, activeOnLinks }: { href?: string; activeOnLinks?: string[] }
) => {
  const isCurrentPathActive = Boolean(matchPath(location.pathname, href ?? ''));
  const isSubItemActive = Boolean(
    activeOnLinks?.find((link) => matchPath(location.pathname, link))
  );
  return isCurrentPathActive || isSubItemActive;
};

type NavLinkProps = {
  icon?: React.ComponentType;
  title: string;
  href: string;
  activeOnLinks?: string[];
};

const NavLink = ({ icon, title, href, activeOnLinks }: NavLinkProps) => {
  const location = useLocation();

  return (
    <SideNavLink
      icon={icon}
      title={title}
      href={href}
      as={Link}
      isActive={isItemActive(location, { href, activeOnLinks })}
    />
  );
};

function Sidebar() {
  return (
    <SideNav position="fixed">
      <SideNavBody>
        <SideNavSection>
          {/* Logo Header */}
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
              3P Ad Network
            </Text>
          </Box>
        </SideNavSection>
        <SideNavSection>
          <NavLink
            icon={HomeIcon}
            title="Dashboard"
            href="/admin/dashboard"
          />
          <NavLink
            icon={AnnouncementIcon}
            title="Campaigns"
            href="/admin/campaigns"
            activeOnLinks={['/admin/campaigns/create', '/admin/campaigns/:id']}
          />
        </SideNavSection>
        <SideNavSection title="Library">
          <NavLink
            icon={UsersIcon}
            title="Advertisers"
            href="/admin/library/advertisers"
            activeOnLinks={['/admin/library/advertisers/:id']}
          />
          <NavLink
            icon={ImageIcon}
            title="Creatives"
            href="/admin/library/creatives"
            activeOnLinks={['/admin/library/creatives/:id']}
          />
        </SideNavSection>
      </SideNavBody>
    </SideNav>
  );
}

export default Sidebar;
