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
import { useIsMobile } from '@/hooks/use-mobile'

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

  const { t } = useTranslation();

  const isMobile = useIsMobile();
  return (
    <header
      className={cn(
        'bg-background flex-col md:flex items-center gap-3 p-2 sm:gap-4  ',
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
          {!isMobile && <Menu />}
        </div>


        <div className=" justify-self-center ">
          <Search className='hidden lg:flex' placeholder={t("navbar.search")} />
          {
            isMobile &&
            <div className='w-full'>
              <RenameDb />
            </div>
          }
        </div>

        <div className="justify-self-end flex gap-2">
          {
            !isMobile &&
            <div className='w-full'>
              <RenameDb />
            </div>
          }
          
          <ThemeSwitch />
          <LanguagesDropdown />

        </div>
      </div>
      {isMobile && <div className='flex justify-center'>
        <Menu />

      </div>
      }
    </header>
  )
}

Header.displayName = 'Header'
