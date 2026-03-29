 
import React, { Suspense } from "react";
import { Loading } from "@/components/layout/loading-modal";
import { useIsMobile } from "@/hooks/use-mobile";


 
const DatabaseDesktopLayout = React.lazy(
    () => import('./desktop-layout')
);

const DatabaseMobileLayout = React.lazy(
    () => import('./mobile-layout')
);
export const DatabaseLayout: React.FC = () => {
    
    const isMobile = useIsMobile() ; 

    return (

        <Suspense
            fallback={
                <Loading/>
            }
        >
            {
                isMobile ? <DatabaseMobileLayout/> : <DatabaseDesktopLayout/> 
            }
            
        </Suspense>
    );
};

export default DatabaseLayout;
