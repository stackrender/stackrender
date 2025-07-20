
import { Route, Routes } from 'react-router-dom';
import useDashboardRoutes from './dashboard-route';
import NotFoundPage from '@/pages/not-found/not-found-page';
const useAppRoutes = () => {
  const dashboardRoutes = useDashboardRoutes();
  return (
    <Routes>
      {dashboardRoutes}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default useAppRoutes;