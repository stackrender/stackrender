import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from '@/components/ui/sidebar'


import { NavGroup } from '../nav-group'
import { useSidebarData } from './data/sidebar-data'
import { Separator } from '@/components/ui/separator';
import { useDiagramOps } from '@/providers/diagram-provider/diagram-provider';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const sidebarData = useSidebarData();
    const { openController } = useDiagramOps();
    return (
        <Sidebar collapsible='icon' variant='floating' {...props} className='bg-card border-r' >
            <SidebarHeader>
                <div className='flex items-center'>
                    <img
                        className='w-8 h-8 p-[6px] rounded-md '
                        src='/stackrender.png'
                    />
                    <h3 className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground truncate font-semibold text-sm '>
                        StackRender
                    </h3>
                </div>
            </SidebarHeader>
            <SidebarContent>
                {sidebarData.navGroups.map((props: any, index: number) => (
                    <div key={props.title}>
                        <NavGroup key={props.title} {...props} onClick={() => openController(true)} />
                        {
                            index != sidebarData.navGroups.length - 1 &&
                            <div className='px-2'>
                                <Separator />
                            </div>
                        }
                    </div>
                ))}
            </SidebarContent>
            <SidebarFooter className='p-0'>
                {sidebarData.footerNavGroups.map((props: any, index: number) => (
                    <div key={props.title}>
                        <NavGroup key={props.title} {...props} />
                        {
                            index != sidebarData.navGroups.length - 1 &&
                            <div className='px-2'>
                                <Separator />
                            </div>
                        }
                    </div>
                ))}
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
