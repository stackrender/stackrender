 
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { AppSidebar } from "@/components/layout/app-sidebar/app-sidebar";
import { Header } from "@/components/header";



interface Props {
    children?: React.ReactNode
}

const Dashboard: React.FC<Props> = ({ children }) => {
    return (
        <SidebarProvider defaultOpen={false}>
            <AppSidebar />
            <div
                id='content'
                className={cn(
                    'ml-auto w-full max-w-full',
                    'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
                    'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
                    'sm:transition-[width] sm:duration-200 sm:ease-linear',
                    'flex h-svh flex-col',
                    'group-data-[scroll-locked=1]/body:h-full',
                    'has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh'
                )}
            >
                <Header className="bg-card border-b pl-3"/>
                {
                    children ? children : <Outlet />
                }
            </div>

        </SidebarProvider>
    )
}



export default Dashboard; 