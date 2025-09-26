import { useTranslation } from "react-i18next"
import { MenuItem } from "../../types";
import { useMemo } from "react";
import { Modals } from "@/providers/modal-provider/modal-contxet";


import { useDatabaseHistory } from "@/providers/database-history/database-history-provider";
import { useDatabase, useDatabaseOperations } from "@/providers/database-provider/database-provider";
import { useModal } from "@/providers/modal-provider/modal-provider";
import { useDiagramOps } from "@/providers/diagram-provider/diagram-provider";
import { TableType } from "@/lib/schemas/table-schema";
import { CardinalityStyle } from "@/lib/database";
import { useTheme } from "@/providers/theme-provider/theme-provider";

export const useMenuData = () => {

    const { t } = useTranslation();
    const { setTheme, theme } = useTheme()
 
    const { open } = useModal();
    const { canRedo, canUndo, undo, redo } = useDatabaseHistory();
    const { deleteMultiTables } = useDatabaseOperations();
    const { database } = useDatabase();
    const { openController, showController, cardinalityStyle, changeCardinalityStyle } = useDiagramOps();

    const menuData: MenuItem[] = useMemo(() => [
        {
            id: "menu.file",
            title: t("menu.file"),
            children: [
                {
                    id: "menu.new",
                    title: t("menu.new"),
                    clickHandler: () => {
                        open(Modals.CREATE_DATABASE)
                    }
                },
                {
                    id: "menu.open",
                    title: t("menu.open"), shortcut: "Ctnl + O", clickHandler: () => {
                        open(Modals.OPEN_DATABASE)
                    }
                },
                {
                    id: "menu.import",
                    title: t("menu.import"),
                    divide: true,
                    clickHandler: () => {
                        open(Modals.IMPORT_DATABASE)
                    }
                },
                {
                    id: "menu.export_sql",
                    title: t("menu.export_sql"),
                    clickHandler: () => {
                        
                        
                        open(Modals.EXPORT_SQL)
                    }
                },
                //{ title: t("menu.export_orm_models"), divide: true },
                {
                    id: "menu.delete_project",
                    title: t("menu.delete_project"), theme: "destructive", clickHandler: () => {
                        open(Modals.DELETE_DATABASE)
                    }
                },
            ],
        },
        {
            id: "menu.edit",
            title: t("menu.edit"),
            children: [

                { id: "menu.undo", title: t("menu.undo"), isDisabled: !canUndo, clickHandler: undo },
                { id: "menu.redo", title: t("menu.redo"), isDisabled: !canRedo, clickHandler: redo },
                {
                    id: "menu.clear",
                    title: t("menu.clear"), clickHandler: () => {
                        const tables = database ? database.tables : [];
                        deleteMultiTables(tables.map((table: TableType) => table.id))
                    }
                },
            ],
        },
        {
            id: "menu.view",
            title: t("menu.view"),
            children: [
                {
                    id: "menu.cardinality_style",
                    title: t("menu.cardinality_style"),
                    divide: true,
                    children: [
                        {
                            id: "menu.symbolic",
                            selected: cardinalityStyle == CardinalityStyle.SYMBOLIC,
                            title: t("menu.symbolic"), clickHandler: () => {  
                                changeCardinalityStyle(CardinalityStyle.SYMBOLIC)
                            }
                        },
                        {
                            id: "menu.numeric",
                            selected: cardinalityStyle == CardinalityStyle.NUMERIC,
                            title: t("menu.numeric"), clickHandler: () => {
                                changeCardinalityStyle(CardinalityStyle.NUMERIC)
                            }
                        },
                        {
                            id: "menu.hidden",
                            selected: cardinalityStyle == CardinalityStyle.HIDDEN,
                            title: t("menu.hidden"), clickHandler: () => {
                                
                                
                                changeCardinalityStyle(CardinalityStyle.HIDDEN)
                            }
                        },

                    ],
                },
                {
                    id: "menu.controller_visibility",
                    title: showController ? t("menu.hide_controller") : t("menu.show_controller"), shortcut: "Ctnl + B", divide: true, clickHandler: () => {
                        openController(!showController)
                    }
                },

                {
                    id: "menu.theme",
                    title: t("menu.theme"),

                    children: [
                        {
                            id: "light",
                            title: t("menu.light"),
                            clickHandler: () => setTheme("light"),
                            selected: theme != "dark",
                        },
                        {
                            id: "dark",
                            title: t("menu.dark"),
                            clickHandler: () => setTheme("dark"),
                            selected: theme == "dark"
                        },
                    ],
                },
            ],
        },
        {
            id: "menu.help",
            title: t("menu.help"),
            children: [
                {
                    id: "menu.join_discord", title: t("menu.join_discord"),
                    clickHandler: () => {
                        window.open("https://discord.gg/DsN8RcPR6Y", "_blank")
                    }
                },
            ],
        },
      
    ], [t, canRedo, canUndo, undo, redo , deleteMultiTables, database, showController, openController, changeCardinalityStyle, cardinalityStyle, theme]);
 



    return menuData ; 
}