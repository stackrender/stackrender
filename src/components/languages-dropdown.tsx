import { languages } from "@/i18";
import { Language } from "@/i18/types";

import { Check } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
    CommandShortcut,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { IconLanguage } from "@tabler/icons-react";

const LanguagesDropDonw: React.FC = ({ }) => {
    const { t, i18n } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState<Language>(() => languages.find((language: Language) => language.code == i18n.language) as Language);


    const changeLanguage = useCallback((language: Language) => {

        i18n.changeLanguage(language.code);
    }, [i18n])



    useEffect(() => {
        setCurrentLanguage(languages.find((language: Language) => language.code == i18n.language) as Language)
    }, [i18n.language])


    return (



        <Popover>
            <PopoverTrigger asChild>
                <Button 
                    size={"icon"}
                    variant={"outline"}
                >

                    <IconLanguage className="size-5"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-1 rounded-md">
                <Command className="rounded-lg border shadow-md ">
                    <CommandInput
                        aria-label={t("navbar.search")}
                        placeholder={`${t("navbar.search")}`}
                    />
                    <CommandList>
                        <CommandEmpty>No language found.</CommandEmpty>
                        {
                            languages.map((language: Language) => (
                                <CommandItem className="flex justify-between cursor-pointer" key={language.code} onSelect={() => changeLanguage(language)}>
                                    <span>{language.name} <span className="text-muted-foreground">({language.nativeName})</span></span>
                                    <CommandShortcut>
                                        {
                                            currentLanguage.code == language.code && <Check className="text-icon size-4" />
                                        }
                                    </CommandShortcut>
                                </CommandItem>
                            ))
                        }
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>


    )
}


export default React.memo(LanguagesDropDonw);




