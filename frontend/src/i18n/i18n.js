import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../../public/locales/en/translation.json';
import te from '../../public/locales/te/translation.json';
import hi from '../../public/locales/hi/translation.json';
import mr from '../../public/locales/mr/translation.json';
import kn from '../../public/locales/kn/translation.json';
import ta from '../../public/locales/ta/translation.json';
import or from '../../public/locales/or/translation.json';
import ml from '../../public/locales/ml/translation.json';
import bn from '../../public/locales/bn/translation.json';
import pa from '../../public/locales/pa/translation.json';
import gu from '../../public/locales/gu/translation.json';
import raj from '../../public/locales/raj/translation.json';
import as from '../../public/locales/as/translation.json';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', region: 'Pan-India / Global', badge: 'EN' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', region: 'Telangana / Andhra Pradesh', badge: 'తె' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी', region: 'Northern & Central India', badge: 'हि' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', region: 'Maharashtra', badge: 'म' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', region: 'Karnataka', badge: 'ಕ' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', region: 'Tamil Nadu', badge: 'த' },
  { code: 'or', name: 'Odia (Orissa)', native: 'ଓଡ଼ିଆ', region: 'Odisha / Eastern India', badge: 'ଓ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', region: 'Kerala', badge: 'മ' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', region: 'West Bengal / Tripura', badge: 'বা' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', region: 'Punjab / Haryana', badge: 'ਪੰ' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', region: 'Gujarat', badge: 'ગુ' },
  { code: 'raj', name: 'Rajasthani', native: 'राजस्थानी', region: 'Rajasthan / Marwar', badge: 'रा' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া', region: 'Assam / North-East', badge: 'অ' },
];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      te: { translation: te },
      hi: { translation: hi },
      mr: { translation: mr },
      kn: { translation: kn },
      ta: { translation: ta },
      or: { translation: or },
      ml: { translation: ml },
      bn: { translation: bn },
      pa: { translation: pa },
      gu: { translation: gu },
      raj: { translation: raj },
      as: { translation: as },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
