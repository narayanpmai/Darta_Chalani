"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export function LanguageSwitcher() {
  const t = useTranslations("Sidebar");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "ne" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <Button
      variant="ghost"
      onClick={toggleLanguage}
      className="w-full flex items-center justify-start gap-3 bg-white/10 hover:bg-white/20 text-white rounded-xl p-3 h-auto"
    >
      <Languages className="w-5 h-5 text-blue-200" />
      <div className="flex flex-col items-start text-left">
        <span className="font-semibold text-sm">
          {locale === "en" ? "नेपाली भाषामा जानुहोस्" : "Switch to English"}
        </span>
        <span className="text-xs text-blue-200">
          {locale === "en" ? "Change language to Nepali" : "भाषा अङ्ग्रेजीमा परिवर्तन गर्नुहोस्"}
        </span>
      </div>
    </Button>
  );
}
