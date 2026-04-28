"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

interface LegalSidePanelProps {
  contactEmail: string;
  onReportClick: () => void;
}

export default function LegalSidePanel({
  contactEmail,
  onReportClick,
}: LegalSidePanelProps) {
  const { language, t } = useLanguage();

  const labels = {
    fr: {
      title: "Assistance & Contact",
      privacyLabel: "Demandes liées à la vie privée",
      privacyValue: "Pour toute demande d'accès, modification ou suppression de vos données :",
      reportLabel: "Signalement",
      reportValue: "Vous avez constaté un comportement inapproprié ou un profil frauduleux ?",
      reportBtn: "Signaler un prestataire",
      disclaimerLabel: "Note importante",
      disclaimerValue: "daro.ma est un intermédiaire. Nous ne sommes pas employeurs des prestataires listés."
    },
    ar: {
      title: "الدعم والتواصل",
      privacyLabel: "طلبات الخصوصية",
      privacyValue: "لأي طلب للوصول إلى بياناتكم أو تعديلها أو حذفها:",
      reportLabel: "البلاغات",
      reportValue: "هل لاحظتم سلوكاً غير لائق أو ملفاً شخصياً احتيالياً؟",
      reportBtn: "الإبلاغ عن مقدم خدمة",
      disclaimerLabel: "ملاحظة هامة",
      disclaimerValue: "daro.ma هو وسيط. نحن لسنا أصحاب عمل لمقدمي الخدمات المدرجين."
    }
  }[language];

  return (
    <div className="legal-callouts">
      <h3>{labels.title}</h3>

      <div className="callout-item">
        <span className="callout-label">{labels.privacyLabel}</span>
        <p className="callout-value" style={{ fontSize: '13px', marginBottom: '8px' }}>
          {labels.privacyValue}
        </p>
        <a href={`mailto:${contactEmail}`} className="callout-link">
          {contactEmail}
        </a>
      </div>

      <div className="callout-item">
        <span className="callout-label">{labels.reportLabel}</span>
        <p className="callout-value" style={{ fontSize: '13px', marginBottom: '8px' }}>
          {labels.reportValue}
        </p>
        <button onClick={onReportClick} className="callout-link">
          {labels.reportBtn}
        </button>
      </div>

      <div className="callout-item">
        <span className="callout-label">{labels.disclaimerLabel}</span>
        <p className="callout-value" style={{ fontSize: '13px' }}>
          {labels.disclaimerValue}
        </p>
      </div>
    </div>
  );
}
