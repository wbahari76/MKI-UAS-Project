"use client";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "id" : "en";
    i18n.changeLanguage(newLang);
    Cookies.set("NEXT_LOCALE", newLang, { path: "/" });
    router.refresh();
  };

  if (!mounted) {
    return <div className="w-[72px] h-[36px] opacity-0" />; // skeleton
  }

  const isEn = i18n.language === "en";

  return (
    <button
      onClick={toggleLanguage}
      className="relative flex items-center justify-between w-[72px] h-[36px] bg-white/5 border border-white/10 rounded-full p-1 cursor-pointer hover:bg-white/10 transition-colors shrink-0"
      aria-label="Toggle language"
    >
      <span className="z-10 text-xs font-semibold w-1/2 text-center text-white/90">
        EN
      </span>
      <span className="z-10 text-xs font-semibold w-1/2 text-center text-white/90">
        ID
      </span>
      <motion.div
        className="absolute top-1 left-1 bottom-1 w-[32px] bg-green-500/20 border border-green-500/30 rounded-full z-0"
        initial={false}
        animate={{
          x: isEn ? 0 : 32,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
    </button>
  );
}
