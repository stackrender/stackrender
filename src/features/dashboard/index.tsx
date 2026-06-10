
import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar/app-sidebar";
import { Header } from "@/components/header";



interface Props {
    children?: React.ReactNode
}

const Dashboard: React.FC<Props> = ({ children }) => {
    return (
        <SidebarProvider defaultOpen={false}>
            <AppSidebar variant="inset" />
            {/* dark:p-0 dark:border-l-1  */}
            <SidebarInset className=" overflow-hidden max-h-screen flex flex-col flex-1 !m-0 !rounded-none bg-sidebar p-1 ">
                {/*dark:border-none dark:rounded-none  */}
                <div className="border-4 border-sidebar-border ring-1 ring-border/30 dark:!border-background  dark:ring-sidebar-border flex flex-col  min-h-0 !overflow-hidden  rounded-2xl h-screen">
                    <div className="overflow-hidden h-full flex flex-col flex-1 bg-white dark:bg-background dark:!border-1 dark:border-sidebar-border dark:rounded-[14px] !overflow-hidden" >
                        <Header className="bg-card border-b pl-3" />
                        {
                            children ? children : <Outlet />
                        }
                    </div>
                </div>

            </SidebarInset>

        </SidebarProvider>
    )
}



export default Dashboard; 