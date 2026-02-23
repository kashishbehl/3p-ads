import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Tabs,
  TabList,
  TabItem,
  TabPanel,
  SIDE_NAV_EXPANDED_L1_WIDTH_BASE,
  SIDE_NAV_EXPANDED_L1_WIDTH_XL,
  HomeIcon,
  AnnouncementIcon,
  UsersIcon,
  ImageIcon,
  TagIcon,
} from '@razorpay/blade/components';
import Sidebar from './Sidebar';

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTab = (): string => {
    const path = location.pathname;
    if (path.startsWith('/admin/campaigns')) return 'campaigns';
    if (path.startsWith('/admin/library/advertisers')) return 'advertisers';
    if (path.startsWith('/admin/library/creatives')) return 'creatives';
    if (path.startsWith('/admin/library/segments')) return 'segments';
    return 'dashboard';
  };

  const handleTabChange = (value: string) => {
    const routes: Record<string, string> = {
      dashboard: '/admin/dashboard',
      campaigns: '/admin/campaigns',
      advertisers: '/admin/library/advertisers',
      creatives: '/admin/library/creatives',
      segments: '/admin/library/segments',
    };
    navigate(routes[value] || '/admin/dashboard');
  };

  const activeTab = getActiveTab();

  return (
    <Box display="flex" minHeight="100vh">
      {/* Minimal dark left sidebar — only "3P Ad Network" */}
      <Sidebar />

      {/* Main content area */}
      <Box
        as="main"
        marginLeft={{
          base: 'spacing.0',
          m: `${SIDE_NAV_EXPANDED_L1_WIDTH_BASE}px`,
          xl: `${SIDE_NAV_EXPANDED_L1_WIDTH_XL}px`,
        }}
        width="100%"
        minHeight="100vh"
        backgroundColor="surface.background.gray.moderate"
      >
        {/* Header with title */}
        <Box
          backgroundColor="surface.background.gray.intense"
          paddingX={{ base: 'spacing.4', m: 'spacing.7' }}
          paddingTop={{ base: 'spacing.4', m: 'spacing.6' }}
          paddingBottom="spacing.0"
        >
          <Heading size="large" marginBottom="spacing.3">
            3P Ad Network
          </Heading>
        </Box>

        {/* Tab navigation + page content */}
        <Tabs value={activeTab} onChange={handleTabChange} isLazy variant="filled">
          <TabList>
            <TabItem value="dashboard" leading={HomeIcon}>
              Dashboard
            </TabItem>
            <TabItem value="campaigns" leading={AnnouncementIcon}>
              Campaigns
            </TabItem>
            <TabItem value="advertisers" leading={UsersIcon}>
              Advertisers
            </TabItem>
            <TabItem value="creatives" leading={ImageIcon}>
              Creatives
            </TabItem>
            <TabItem value="segments" leading={TagIcon}>
              Segments
            </TabItem>
          </TabList>
          <TabPanel value="dashboard">
            <Box padding={{ base: 'spacing.4', m: 'spacing.7' }}>
              <Outlet />
            </Box>
          </TabPanel>
          <TabPanel value="campaigns">
            <Box padding={{ base: 'spacing.4', m: 'spacing.7' }}>
              <Outlet />
            </Box>
          </TabPanel>
          <TabPanel value="advertisers">
            <Box padding={{ base: 'spacing.4', m: 'spacing.7' }}>
              <Outlet />
            </Box>
          </TabPanel>
          <TabPanel value="creatives">
            <Box padding={{ base: 'spacing.4', m: 'spacing.7' }}>
              <Outlet />
            </Box>
          </TabPanel>
          <TabPanel value="segments">
            <Box padding={{ base: 'spacing.4', m: 'spacing.7' }}>
              <Outlet />
            </Box>
          </TabPanel>
        </Tabs>
      </Box>
    </Box>
  );
}

export default AdminLayout;
