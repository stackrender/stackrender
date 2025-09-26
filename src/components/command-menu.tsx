import React from 'react'

import {
    IconArrowRightDashed,
    IconChevronRight,
    IconDeviceLaptop,
    IconMoon,
    IconSun,
} from '@tabler/icons-react'
import { useSearch } from '@/providers/search-provider/search-provider'
import { useTheme } from '@/providers/theme-provider/theme-provider'
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command'
import { useSidebarData } from '@/components/layout/app-sidebar/data/sidebar-data'
import { ScrollArea } from './ui/scroll-area'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function CommandMenu() {
    const navigate = useNavigate()
    const { setTheme } = useTheme()
    const { open, setOpen } = useSearch()

    const runCommand = React.useCallback(
        (command: () => unknown) => {
            setOpen(false)
            command()
        },
        [setOpen]
    )


    const { t } = useTranslation() ; 


    const sidebarData = useSidebarData();

    return (
        <CommandDialog modal open={open} onOpenChange={setOpen}>
            <CommandInput placeholder={t("navbar.command")} />
            <CommandList>
                <ScrollArea type='hover' className='h-72 pr-1'>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {sidebarData.navGroups.map((group: any) => (
                        <CommandGroup key={group.title} heading={group.title}>
                            {group.items.map((navItem: any, i: number) => {
                                if (navItem.url)
                                    return (
                                        <CommandItem
                                            key={`${navItem.url}-${i}`}
                                            value={navItem.title}
                                            onSelect={() => {
                                                runCommand(() => navigate(navItem.url))
                                            }}
                                        >
                                            <div className='mr-2 flex h-4 w-4 items-center justify-center'>
                                                <IconArrowRightDashed className='text-muted-foreground/80 size-2' />
                                            </div>
                                            {navItem.title}
                                        </CommandItem>
                                    )

                                return navItem.items?.map((subItem: any, i: number) => (
                                    <CommandItem
                                        key={`${navItem.title}-${subItem.url}-${i}`}
                                        value={`${navItem.title}-${subItem.url}`}
                                        onSelect={() => {
                                            runCommand(() => navigate(subItem.url))
                                        }}
                                    >
                                        <div className='mr-2 flex h-4 w-4 items-center justify-center'>
                                            <IconArrowRightDashed className='text-muted-foreground/80 size-2' />
                                        </div>
                                        {navItem.title} <IconChevronRight /> {subItem.title}
                                    </CommandItem>
                                ))
                            })}
                        </CommandGroup>
                    ))}
                    <CommandSeparator />
                    <CommandGroup heading='Theme'>
                        <CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
                            <IconSun /> <span>{t("menu.light")}</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
                            <IconMoon className='scale-90' />
                            <span>{t("menu.dark")}</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => setTheme('system'))}>
                            <IconDeviceLaptop />
                            <span>{t("menu.system")}</span>
                        </CommandItem>
                    </CommandGroup>
                </ScrollArea>
            </CommandList>
        </CommandDialog>
    )
}
