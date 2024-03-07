import React from 'react';
import { useTranslation } from 'react-i18next';
import useColorMode from '../hooks/useColorMode';

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const [colorMode, setColorMode] = useColorMode();
  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLanguage);
  };
  return (
    <li className="flex flex-row items-center w-3/5 justify-end space-x-5">
      <h4>Switch Language</h4>
      <label
        className={`relative m-0 block h-7.5 w-14 rounded-full ${
          colorMode === 'dark' ? 'bg-primary' : 'bg-stroke'
        }`}
      >
        <input
          type="checkbox"
          onChange={toggleLanguage}
          className="dur absolute top-0 z-50 m-0 h-full w-full cursor-pointer opacity-0"
        />
        <span
          className={`absolute top-1/2 left-[3px] flex h-6 w-6 -translate-y-1/2 translate-x-0 items-center justify-center rounded-full bg-white shadow-switcher duration-75 ease-linear ${
            i18n.language === 'en' && '!right-[3px] !translate-x-full'
          }`}
        >
          <span className="hidden dark:inline-block text-black-2">
            {i18n.language === 'en' ? 'en' : ''}
          </span>
          <span className="hidden dark:inline-block text-black-2">
            {i18n.language === 'ar' ? 'ar' : ''}
          </span>
        </span>
      </label>
    </li>
  );
};

export default LanguageSwitcher;
