
import Database from '@/features/database/';
import RelationshipController from '@/features/database/components/db-controller/relationship-controller';
import TablesController from '@/features/database/components/db-controller/tables-controller';
import { Navigate, Route } from 'react-router-dom';


const useDatabaseRoutes = () => {

    return (
        <Route path="/database" element={<Database />} >
            <Route index element={<Navigate to="tables" replace />} />
            <Route path='tables' element={<TablesController />}></Route>
            <Route path='relationships' element={<RelationshipController />}></Route>
        
        </Route>
    );
};

export default useDatabaseRoutes;