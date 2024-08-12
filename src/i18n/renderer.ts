import i18n from 'i18next';
import { initReactI18next } from "react-i18next";
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(
    resourcesToBackend((language: string, namespace: string) => import(`../locales/${language}/${namespace}.json`))
  )
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ["en", "fr"]
  });

export default i18n;