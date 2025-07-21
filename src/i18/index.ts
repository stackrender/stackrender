

import { Language } from "./types";
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';


import { en, enLanguage } from "./languages/en";
import { fr, frLanguage } from "./languages/fr";
import { ar, arLanguage } from "./languages/ar";
import { es, esLanguage } from "./languages/es";
import { zh, zhLanguage } from "./languages/zh";
import { hi, hiLanguage } from "./languages/hi";
import { pt, ptLanguage } from "./languages/pt";
import { ru, ruLanguage } from "./languages/ru";
import { de, deLanguage } from "./languages/de";


export const languages: Language[] = [
    enLanguage,
    frLanguage,
    arLanguage,
    esLanguage,
    zhLanguage,
    hiLanguage,
    ptLanguage,
    ruLanguage,
    deLanguage,
];

const resources = {
    en,
    fr,
    ar,
    es,
    zh,
    hi,
    pt,
    ru,
    de,
};
i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en',

        interpolation: {
            escapeValue: false,
        },
        fallbackLng: enLanguage.code,
        debug: false,
    });

export { i18n };