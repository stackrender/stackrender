
import Dashboard from '@/features/dashboard/';
import { Navigate, Route } from 'react-router-dom';
import useDatabaseRoutes from './database-route';



const useDashboardRoutes = () => {
    const databaseRoutes = useDatabaseRoutes();
    return (
        <Route path="" element={<Dashboard />}>
            <Route index element={<Navigate to="database" replace />} />
            {databaseRoutes}
        </Route>

    );
};

export default useDashboardRoutes;