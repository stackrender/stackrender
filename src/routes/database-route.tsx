
import DashboardPage from '@/pages/dashboard/dashboard-page';
import DatabasePage from '@/pages/database/database-page';
import RelationshipController from '@/pages/database/db-controller/relationship-controller/relationship-controller';
import TablesController from '@/pages/database/db-controller/tables-controller/tables-controller';
import { Navigate, Route, Routes } from 'react-router-dom';


const useDatabaseRoutes = () => {

    return (
        <Route path="/database" element={<DatabasePage />} >
            <Route path='tables' element={<TablesController />}></Route>
            <Route path='relationships' element={<RelationshipController />}></Route>
            <Route path='bot' element={<DatabasePage />}></Route>
        </Route>
    );
};

export default useDatabaseRoutes;