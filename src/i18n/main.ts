import { join } from "path";
import i18n from "i18next";
import FsBackend from "i18next-fs-backend";

const getResourcesPath = (): string => {
  return process.env.NODE_ENV === "development" ? "." : process.resourcesPath;
};

export function initMainI18n() {
  return i18n
    .use(FsBackend)
    .init({
      supportedLngs: ["en", "fr"],
      saveMissing: true,
      fallbackLng: "en",
      lng: "fr",
      backend: {
        loadPath: join(
          getResourcesPath(),
          "app/localization/locales/{{lng}}/{{ns}}.json"
        ),
      },
    });
}
