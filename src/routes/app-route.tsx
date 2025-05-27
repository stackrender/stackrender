
import {  Routes } from 'react-router-dom';
import useDashboardRoutes from './dashboard-route';
const useAppRoutes = () => {  
  const dashboardRoutes = useDashboardRoutes();
  return (
    <Routes>
      {dashboardRoutes}
    </Routes>
  );
};

export default useAppRoutes;