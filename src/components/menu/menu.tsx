
import { useTheme } from "next-themes";
import DropdownMenu, { MenuDropdownProps } from "./menu-dropdown";
import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useModal } from "@/providers/modal-provider/modal-provider";
import { Modals } from "@/providers/modal-provider/modal-contxet";
import { useDatabaseHistory } from "@/providers/database-history/database-history-provider";
import { useDatabase, useDatabaseOperations } from "@/providers/database-provider/database-provider";
import { TableType } from "@/lib/schemas/table-schema";
import { useDiagramOps } from "@/providers/diagram-provider/diagram-provider";
import { CardinalityStyle } from "@/lib/database";


const Menu: React.FC = ({ }) => {

    const { setTheme, resolvedTheme } = useTheme()

    const { t } = useTranslation();
    const { open } = useModal();
    const { canRedo, canUndo, undo, redo } = useDatabaseHistory();
    const { deleteMultiTables } = useDatabaseOperations();
    const { database } = useDatabase();
    const { setShowController, showController, cardinalityStyle, setCardinalityStyle } = useDiagramOps();

    const menu: MenuDropdownProps[] = useMemo(() => [
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
                    title: t("menu.delete_project"), theme: "danger", clickHandler: () => {
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
                                setCardinalityStyle(CardinalityStyle.SYMBOLIC)
                            }
                        },
                        {
                            id: "menu.numeric",
                            selected: cardinalityStyle == CardinalityStyle.NUMERIC,
                            title: t("menu.numeric"), clickHandler: () => {
                                setCardinalityStyle(CardinalityStyle.NUMERIC)
                            }
                        },
                        {
                            id: "menu.hidden",
                            selected: cardinalityStyle == CardinalityStyle.HIDDEN,
                            title: t("menu.hidden"), clickHandler: () => {
                                setCardinalityStyle(CardinalityStyle.HIDDEN)
                            }
                        },

                    ],
                },
                {
                    id: "menu.controller_visibility",
                    title: showController ? t("menu.hide_controller") : t("menu.show_controller"), shortcut: "Ctnl + B", divide: true, clickHandler: () => {
                        setShowController(!showController)
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
                            selected: resolvedTheme == "light",
                        },
                        {
                            id: "dark",
                            title: t("menu.dark"),
                            clickHandler: () => setTheme("dark"),
                            selected: resolvedTheme == "dark"
                        },
                    ],
                },
            ],
        },
        {
            id: "menu.help",
            title: t("menu.help"),
            children: [

                { id: "menu.show_docs", title: t("menu.show_docs") },
                { id: "menu.join_discord", title: t("menu.join_discord") },
            ],
        },
    ], [t, canRedo, canUndo, undo, redo, deleteMultiTables, database, showController, setShowController, cardinalityStyle, setCardinalityStyle, resolvedTheme]);

    return <div className="gap-1 flex">
        {
            menu.map((menuItem, index) => (
                <DropdownMenu  {...menuItem} key={menuItem.id} />
            ))
        }
    </div>
}


export default React.memo(Menu); 