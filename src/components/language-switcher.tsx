"use client";

import { useEffect, useState } from "react";

const LanguageSwitcher = () => {
  const [currentLang, setCurrentLang] = useState<"en" | "ar">("en");
  useEffect(() => {
    const cookieLang = document.cookie
      .split("; ")
      .find((row) => row.startsWith("locale="))
      ?.split("=")[1] as "en" | "ar" | undefined;

    if (cookieLang) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentLang(cookieLang);
    }
  }, []);

  const changeLanguage = async (language: "en" | "ar") => {
    const newLang = currentLang === "en" ? "ar" : "en";
    await fetch("/api/set-locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: language }),
    });
    setCurrentLang(newLang);
    window.location.reload();
  };

  return (
    <div className="language-switcher">
      <button
        className={`lang-btn ${currentLang === "en" && "active"}`}
        onClick={() => changeLanguage("en")}
      >
        🇺🇸 English
      </button>
      <button
        className={`lang-btn ${currentLang === "ar" && "active"}`}
        onClick={() => changeLanguage("ar")}
      >
        EG العربية
      </button>
    </div>
  );
};

export default LanguageSwitcher;
