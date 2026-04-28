"use client";

import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { useLanguage } from "@/context/LanguageContext";
import { LEGAL_CONTENT } from "@/utils/legal-content";

export default function PrivacyPolicyPage() {
  const { language } = useLanguage();
  const content = LEGAL_CONTENT.privacy[language];

  return (
    <LegalPageLayout 
      title={content.title}
      subtitle={content.subtitle}
      lastUpdated={content.lastUpdated}
      sections={content.sections}
    />
  );
}

