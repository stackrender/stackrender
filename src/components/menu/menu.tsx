
import { useTheme } from "next-themes";
import DropdownMenu, { MenuDropdownProps } from "./menu-dropdown";
import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useModal } from "@/providers/modal-provider/modal-provider";
import { Modals } from "@/providers/modal-provider/modal-contxet";









interface MenuProps {
}

const Menu: React.FC<MenuProps> = ({ }) => {

    const { setTheme } = useTheme()

    const { t } = useTranslation();
    const { open } = useModal();

    useEffect(() => { 
              open(Modals.IMPORT_DATABASE)
    } , [])
    const menu: MenuDropdownProps[] = useMemo(() => [
        {
            title: t("menu.file"),
            children: [
                {
                    title: t("menu.new"),
                    clickHandler: () => {
                        open(Modals.CREATE_DATABASE)
                    }

                },
                {
                    title: t("menu.open"), shortcut: "Ctnl + O", clickHandler: () => {
                        open(Modals.OPEN_DATABASE)
                    }
                },
                { title: t("menu.save"), shortcut: "Ctnl + S", divide: true },
                {
                    title: t("menu.import"),
                    divide: true,
                    clickHandler: () => {
                        open(Modals.IMPORT_DATABASE)
                    }
                },
                {
                    title: t("menu.export_sql"),
                    children: [
                        { title: t("menu.generic") },
                        { title: t("menu.mysql") },
                        { title: t("menu.postgresql") },
                    ],
                },
                { title: t("menu.export_orm_models"), divide: true },
                {
                    title: t("menu.delete_project"), theme: "danger", clickHandler: () => {
                        open(Modals.DELETE_DATABASE)
                    }
                },
            ],
        },
        {
            title: t("menu.edit"),
            clickHandler: () => console.log("hello wo"),
            children: [
                { title: t("menu.undo"), isDisabled: true },
                { title: t("menu.redo"), isDisabled: true },
                { title: t("menu.clear") },
            ],
        },
        {
            title: t("menu.view"),
            children: [
                { title: t("menu.hide_controller"), shortcut: "Ctnl + B", divide: true },
                {
                    title: t("menu.zoom_on_scroll"),
                    divide: true,
                    children: [
                        { title: t("menu.on") },
                        { title: t("menu.off") },
                    ],
                },
                {
                    title: t("menu.theme"),
                    clickHandler: () => console.log("hello wo"),
                    children: [
                        {
                            title: t("menu.light"),
                            clickHandler: () => setTheme("light"),
                        },
                        {
                            title: t("menu.dark"),
                            clickHandler: () => setTheme("dark"),
                        },
                    ],
                },
            ],
        },
        {
            title: t("menu.help"),
            children: [
                { title: t("menu.show_docs") },
                { title: t("menu.join_discord") },
            ],
        },
    ], [t]);
    return <div className="gap-1 flex">
        {
            menu.map((menuItem, index) => (
                <DropdownMenu  {...menuItem} key={index} />
            ))
        }
    </div>
}


export default React.memo(Menu); 