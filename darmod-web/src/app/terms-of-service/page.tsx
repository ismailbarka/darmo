"use client";

import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { useLanguage } from "@/context/LanguageContext";
import { LEGAL_CONTENT } from "@/utils/legal-content";

export default function TermsOfServicePage() {
  const { language } = useLanguage();
  const content = LEGAL_CONTENT.terms[language];

  return (
    <LegalPageLayout 
      title={content.title}
      subtitle={content.subtitle}
      lastUpdated={content.lastUpdated}
      sections={content.sections}
    />
  );
}

