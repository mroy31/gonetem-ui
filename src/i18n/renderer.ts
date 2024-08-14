import i18n, { BackendModule } from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const IPCBackend = (): BackendModule => {
  return {
    type: "backend",

    init: function (services, backendOptions, i18nextOptions) {
      this.services = services;
    },

    read: function (language, namespace): Promise<{ [key: string]: string }> {
      return new Promise<{ [key: string]: string }>((resolve, err) => {
        window.api.i18nRead(language, namespace).then((res) => {
          res.status ? resolve(res.result) : err(res.error);
        });
      });
    },

    create: function (languages, namespace, key, fallbackValue) {
      return new Promise<void>((resolve, err) => {
        window.api
          .i18nCreate(languages as string[], namespace, key, fallbackValue)
          .then((res) => {
            res.status ? resolve() : err(res.error);
          });
      });
    },
  };
};

i18n
  .use(IPCBackend())
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ["en", "fr"],
    saveMissing: true,
    fallbackLng: "en",
  });

export default i18n;
