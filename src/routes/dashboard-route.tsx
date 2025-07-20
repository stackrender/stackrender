
import DashboardPage from '@/pages/dashboard/dashboard-page';
import { Navigate, Route } from 'react-router-dom';
import useDatabaseRoutes from './database-route';
import NotFoundPage from '@/pages/not-found/not-found-page';




const useDashboardRoutes = () => {
    const databaseRoutes = useDatabaseRoutes();
    return (
        <Route path="" element={<DashboardPage />}>
            <Route index element={<Navigate to="database" replace />} />
            {databaseRoutes}
    
        </Route>

    );
};

export default useDashboardRoutes;