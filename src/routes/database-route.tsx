
import DatabasePage from '@/pages/database/database-page';
import RelationshipController from '@/pages/database/db-controller/relationship-controller/relationship-controller';
import TablesController from '@/pages/database/db-controller/tables-controller/tables-controller';
import { Navigate, Route } from 'react-router-dom';


const useDatabaseRoutes = () => {

    return (
        <Route path="/database" element={<DatabasePage />} >
             <Route index element={<Navigate to="tables" replace />} />
            <Route path='tables' element={<TablesController />}></Route>
            <Route path='relationships' element={<RelationshipController />}></Route>
        
        </Route>
    );
};

export default useDatabaseRoutes;