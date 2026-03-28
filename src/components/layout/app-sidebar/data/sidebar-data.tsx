import {    
    IconBrandDiscord,
    IconBrandGithub,
    IconBrandX, 
    IconSparkles,
    IconTableAlias,
    IconVectorSpline,
} from '@tabler/icons-react'

import type { SidebarData } from '../../types';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { BookIcon } from 'lucide-react';

export const useSidebarData = () => {

    const { t } = useTranslation();

    const sidebarData: SidebarData = useMemo(() => ({
        navGroups: [
            {
                title: t("sidebar.database"),
                items: [
                    {
                        title: t("sidebar.tables"),
                        url: '/database/tables',
                        icon: IconTableAlias,
                    },
                    {
                        title: t("sidebar.relationships"),
                        url: '/database/relationships',
                        icon: IconVectorSpline,
                    },
           
                ],
            },
            
        ],
        footerNavGroups:[ {
            title: '',
            items: [ 
                {
                    title: "Discord",
                    url: "https://discord.gg/4dv26jR4Pj",
                    icon: IconBrandDiscord,
                    newTab : true
                },
                {
                    title: "Github",
                    url: "https://github.com/stackrender/stackrender",
                    icon: IconBrandGithub,
                    newTab : true
                },
                {
                    title : t("sidebar.documentation") , 
                    url : "https://www.stackrender.io/docs" , 
                    icon : BookIcon, 
                    newTab : true  
                }

            ],
        }] 
    }), [t])

    return sidebarData;
}
