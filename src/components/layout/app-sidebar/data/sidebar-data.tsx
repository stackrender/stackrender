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
                    title: "X",
                    url: "https://x.com/Iam_The_Dev",
                    icon: IconBrandX,
                    newTab : true
                },
                {
                    title: "Discord",
                    url: "https://discord.gg/DsN8RcPR6Y",
                    icon: IconBrandDiscord,
                    newTab : true
                },
                {
                    title: "Github",
                    url: "https://github.com/stackrender/stackrender",
                    icon: IconBrandGithub,
                    newTab : true
                },

            ],
        }] 
    }), [t])

    return sidebarData;
}
