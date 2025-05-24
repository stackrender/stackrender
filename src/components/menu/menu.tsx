
import { useTheme } from "next-themes";
import DropdownMenu, { MenuDropdownProps } from "./menu-dropdown";
import React, { useMemo } from "react";
import { menuItem } from "@heroui/react";
import { useTranslation } from "react-i18next";









interface MenuProps {
}

const Menu: React.FC<MenuProps> = ({ }) => {

    const { setTheme } = useTheme()


    const { t } = useTranslation();
    const menu: MenuDropdownProps[] = useMemo(() => [
        {
            title: t("menu.file"),
            children: [
                { title: t("menu.new") },
                { title: t("menu.open"), shortcut: "Ctnl + O" },
                { title: t("menu.save"), shortcut: "Ctnl + S", divide: true },
                {
                    title: t("menu.import"),
                    divide: true,
                    children: [
                        { title: t("menu.json") },
                        { title: t("menu.dbml") },
                        { title: t("menu.mysql") },
                        { title: t("menu.postgresql") },
                    ],
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
                { title: t("menu.delete_project"), theme: "danger" },
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