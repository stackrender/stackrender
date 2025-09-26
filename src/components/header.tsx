import React, { useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import Menu from './layout/menu/menu'
import { Search } from './search'
import { Button } from './ui/button'

//import { ProfileDropdown } from './profile-dropdown'

import { useModal } from '@/providers/modal-provider/modal-provider'
import { Modals } from '@/providers/modal-provider/modal-contxet'
import { useTranslation } from 'react-i18next'
import { ThemeSwitch } from './theme-switch'
import RenameDb from '@/features/database/components/rename-db'
import LanguagesDropdown from './languages-dropdown'

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export const Header = ({
  className,
  fixed,
  children,
  ...props
}: HeaderProps) => {
  const [offset, setOffset] = React.useState(0)

  React.useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    }
    // Add scroll listener to the body
    document.addEventListener('scroll', onScroll, { passive: true })
    // Clean up the event listener on unmount
    return () => document.removeEventListener('scroll', onScroll)
  }, []);




  const { open } = useModal();


  const { t } = useTranslation();


  return (
    <header
      className={cn(
        'bg-background  flex  items-center gap-3 p-2 sm:gap-4  ',
        fixed && 'header-fixed peer/header fixed z-50 w-[inherit] rounded-md ',
        offset > 10 && fixed ? 'shadow-sm' : 'shadow-none',
        className
      )}
      {...props}
    >
      <div className='grid grid-cols-3 items-center w-full '>
        <div className="justify-self-start flex h-8 gap-3 items-center  ">
          <SidebarTrigger variant='outline' className='scale-125 sm:scale-100' />
          <Separator orientation='vertical' className='h-6' />
          <Menu />
        </div>


        <div className=" justify-self-center ">
          <Search className='hidden md:flex' placeholder={t("navbar.search")} />
        </div>

        <div className="justify-self-end flex gap-2">

          <RenameDb />
          <ThemeSwitch />
          <LanguagesDropdown />

        </div>
      </div>

    </header>
  )
}

Header.displayName = 'Header'
