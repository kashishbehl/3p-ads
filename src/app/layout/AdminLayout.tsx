import { Outlet } from 'react-router-dom';
import {
  Box,
  SIDE_NAV_EXPANDED_L1_WIDTH_BASE,
  SIDE_NAV_EXPANDED_L1_WIDTH_XL,
} from '@razorpay/blade/components';
import Sidebar from './Sidebar';

function AdminLayout() {
  return (
    <Box display="flex" minHeight="100vh">
      <Sidebar />
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
        <Box padding={{ base: 'spacing.4', m: 'spacing.7' }} overflowY="auto" height="100vh">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default AdminLayout;

