import { en, enLanguage } from "./languages/en";
import { fr, frLanguage } from "./languages/fr";
import { Language } from "./types";

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { ar, arLanguage } from "./languages/ar";



export const languages: Language[] = [
    enLanguage,
    frLanguage , 
    arLanguage
];


const resources = {
    en,
    fr,
    ar
};



i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources ,
        lng: 'fr',  

        interpolation: {
            escapeValue: false,
        },
        fallbackLng: enLanguage.code,
        debug: false,
    });

export { i18n };