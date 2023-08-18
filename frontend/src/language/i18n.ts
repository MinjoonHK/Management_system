import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "./translationEN.json";
import translationKO from "./translationKO.json";
import translationCN from "./translationCN.json";
import translationTCN from "./translationTCN.json";
import React from "react";

const resources = {
  en: {
    //translation: FileName
    translation: translationEN,
  },
  ko: {
    translation: translationKO,
  },
  cn: {
    translation: translationCN,
  },
  tcn: {
    translation: translationTCN,
  },
};

i18n
  .use({
    type: "languageDetector",

    /** Must return detected language */
    detect() {
      //: string | readonly string[] | undefined;
      if (localStorage.getItem("lng")) {
        return localStorage.getItem("lng");
      }
      return "en";
    },

    cacheUserLanguage(lng, options) {
      localStorage.setItem("lng", lng);
    },
  })
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources, //using resource defined above
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export const I18nContext = React.createContext(i18n);
