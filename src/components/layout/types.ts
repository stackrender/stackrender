
 


interface BaseNavItem {
    title: string
    badge?: string
    icon?: React.ElementType
}

type NavLink = BaseNavItem & {
    url: string
    items?: never; 
    newTab? : boolean
}

type NavCollapsible = BaseNavItem & {
    items: (BaseNavItem & { url: string })[]
    url?: never
}

type NavItem = NavCollapsible | NavLink

interface NavGroup {
    title: string
    items: NavItem[]
}

interface SidebarData {

    
    footerNavGroups : NavGroup[]
    navGroups: NavGroup[]
}


interface MenuItem {
    id: string;
    title?: string;
    children?: MenuItem[];
    theme?: "default" | "destructive",
    isDisabled?: boolean,
    divide?: boolean,
    shortcut?: string,
    isOpen?: boolean,
    selected?: boolean;
    clickHandler?: () => void
}

export type { SidebarData, NavGroup, NavItem, NavCollapsible, NavLink , MenuItem }
