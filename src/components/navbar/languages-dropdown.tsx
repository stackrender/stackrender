import { languages } from "@/i18";
import { Language } from "@/i18/types";
import { Button, Input, Listbox, ListboxItem, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { Check, Languages, Search } from "lucide-react";
import React, { Ref, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const LanguagesDropDonw: React.FC = ({ }) => {
    const { t, i18n } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState<Language>(() => languages.find((language: Language) => language.code == i18n.language) as Language);
    const [languageList, setLanguageList] = useState<Language[]>(languages);
    const searchRef: Ref<HTMLInputElement> = useRef<HTMLInputElement>(null);
    const changeLanguage = useCallback((language: Language) => {
        i18n.changeLanguage(language.code);
    }, [i18n])



    useEffect(() => {
        setCurrentLanguage(languages.find((language: Language) => language.code == i18n.language) as Language)
    }, [i18n.language])

    const searchLanguage = () => {

        if (!searchRef.current?.value || searchRef.current?.value.trim().length == 0) {
           
            setLanguageList(languages);
        }else
            setLanguageList(languages.filter((language: Language) =>
                language.code.toLowerCase().includes(searchRef.current?.value.toLowerCase() as string) ||
                language.name.toLowerCase().includes(searchRef.current?.value.toLowerCase() as string) ||
                language.nativeName.toLowerCase().includes(searchRef.current?.value.toLowerCase() as string)   
            ))
        console.log(searchRef.current?.value);
    }

    const openChange = useCallback((isOpen : boolean) => { 
        
        if (isOpen) 
            setLanguageList(languages)
    } , [])

    return (
        <Popover showArrow placement="bottom" radius="sm" shadow="sm" onOpenChange={openChange}>
            <PopoverTrigger>
                <Button
                    variant="bordered"
                    radius="sm"

                    startContent={
                        <Languages className="size-4 text-font/90 dark:text-white" />
                    }
                    className="p-0 h-9  min-w-[142px] border-1 border-divider dark:border-font/10 text-xs bg-transparent hover:bg-default text-font/90 font-semibold "
                >
                    <span>
                        {currentLanguage.nativeName} <span className="text-font/70">({currentLanguage.name})</span>
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-2">
                <Input
                    variant="flat"
                    size="sm"
                    aria-label={t("navbar.search")}
                    placeholder={`${t("navbar.search")}`}
                    ref={searchRef}
                    onKeyUp={searchLanguage}
                    startContent={
                        <Search className="size-4 text-icon" />
                    }
                    className="h-8 w-full focus-visible:ring-0 shadow-none "
                    classNames={{
                        inputWrapper: "dark:bg-default border-divider group-hover:border-primary  group-data-[focus=true]:border-primary group-data-[focus=true]:bg-default",

                    }}
                />
                <hr className="my-2 w-full border-divider" />

                <Listbox aria-label="Languages"

                >
                    {
                        languageList.map((language: Language) => (
                            <ListboxItem

                                key={language.code}
                                textValue={language.code}
                                endContent={
                                    currentLanguage.code == language.code && <Check className="text-icon size-4" />
                                }
                                onPressEnd={() => changeLanguage(language)}
                                className="text-font/90"
                            >

                                {language.nativeName} <span className="text-font/70"> ({language.name})</span>
                            </ListboxItem>
                        ))
                    }


                </Listbox>
            </PopoverContent>
        </Popover>
    )
}


export default React.memo(LanguagesDropDonw); 