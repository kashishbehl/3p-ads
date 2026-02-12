import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout';
import Dashboard from '../modules/dashboard/pages/Dashboard';
import CampaignsList from '../modules/campaigns/pages/CampaignsList';
import CampaignWizard from '../modules/campaigns/pages/CampaignWizard';
import CampaignWorkspace from '../modules/campaigns/pages/CampaignWorkspace';
import AdvertisersList from '../modules/library/pages/AdvertisersList';
import AdvertiserDetail from '../modules/library/pages/AdvertiserDetail';
import CreativesList from '../modules/library/pages/CreativesList';
import CreativeDetail from '../modules/library/pages/CreativeDetail';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="campaigns" element={<CampaignsList />} />
        <Route path="campaigns/create" element={<CampaignWizard />} />
        <Route path="campaigns/:id" element={<CampaignWorkspace />} />
        <Route path="library/advertisers" element={<AdvertisersList />} />
        <Route path="library/advertisers/:id" element={<AdvertiserDetail />} />
        <Route path="library/creatives" element={<CreativesList />} />
        <Route path="library/creatives/:id" element={<CreativeDetail />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

export default AppRoutes;
