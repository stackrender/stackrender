
import DashboardPage from '@/pages/dashboard/dashboard-page';
import DatabasePage from '@/pages/database/database-page';
import { Route } from 'react-router-dom';
import useDatabaseRoutes from './database-route';




const useDashboardRoutes = () => {
    const databaseRoutes = useDatabaseRoutes() ; 
    return (
        <Route path="" element={<DashboardPage />}>
            {databaseRoutes}
        </Route>

    );
};

export default useDashboardRoutes;