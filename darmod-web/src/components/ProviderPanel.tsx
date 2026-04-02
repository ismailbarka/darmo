"use client";

import React from "react";
import { Provider } from "@/types";
import { getCategoryColor } from "@/utils/categoryColors";
import { formatDistance } from "@/utils/formatDistance";
import { messageHandler } from "@/utils/messageHandler";
import { trackEvent } from "@/services/analytics";
import { useLanguage } from "@/context/LanguageContext";
import ActionButtons from "./ActionButtons";

interface ProviderPanelProps {
  provider: Provider;
  onClose: () => void;
  source: "map" | "list";
}

export default function ProviderPanel({
  provider,
  onClose,
  source,
}: ProviderPanelProps) {
  const { language, t } = useLanguage();
  const fullName =
    language === "ar"
      ? `${provider.firstnameAr} ${provider.lastnameAr}`
      : `${provider.firstnameFr} ${provider.lastnameFr}`;
  const categoryName =
    language === "ar"
      ? provider.categoryNameAr || provider.category?.nameAr || ""
      : provider.categoryNameFr || provider.category?.nameFr || "";
  const description =
    language === "ar" ? provider.descriptionAr : provider.descriptionFr;
  const categoryColor = getCategoryColor(provider.categoryId);

  React.useEffect(() => {
    trackEvent("provider_card_viewed", {
      provider_id: provider.id,
      provider_name: fullName,
      category: categoryName,
      distance_meters: Math.round(provider.distance || 0),
      source,
    });
  }, [provider.id, fullName, categoryName, provider.distance, source]);

  return (
    <>
      <div className="panel-overlay" onClick={onClose} />
      <div className="provider-panel">
        <div className="panel-header">
          <button
            className="panel-share-btn"
            onClick={() => {
              trackEvent("provider_shared", {
                provider_id: provider.id,
                provider_name: fullName,
                category: categoryName,
              });
              const msg = messageHandler(
                fullName,
                categoryName,
                provider.phone,
              );
              if (navigator.share) {
                navigator.share({ title: fullName, text: msg }).catch(() => {});
              } else {
                navigator.clipboard
                  .writeText(msg)
                  .then(() => alert("Copied to clipboard!"));
              }
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#666"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
          <button className="panel-close-btn" onClick={onClose}>
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#666"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="panel-body">
          <div className="profile-photo" style={{ borderColor: categoryColor }}>
            {provider.photo ? (
              <img
                src={provider.photo}
                alt={fullName}
                className="profile-img"
              />
            ) : (
              <img
                src="/profile.png"
                alt={fullName}
                className="profile-img"
              />
            )}
          </div>

          <h2 className="panel-name">{fullName}</h2>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              marginBottom: 12,
            }}
          >
            {provider.rating && (
              <span
                className="rating-badge"
                style={{ fontSize: "1rem", color: "#ff9800" }}
              >
                ★ {provider.rating}
              </span>
            )}
            {provider.age && (
              <span className="age-badge" style={{ color: "#666" }}>
                {provider.age} {t("age_years")}
              </span>
            )}
          </div>

          <div className="panel-info-row">
            <span
              className="category-badge"
              style={{
                backgroundColor: categoryColor + "20",
                color: categoryColor,
              }}
            >
              <span
                className="badge-dot"
                style={{ backgroundColor: categoryColor }}
              />
              {categoryName}
            </span>
            <span className="distance-badge">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#666"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
              </svg>
              {formatDistance(provider.distance || 0)}
            </span>
          </div>

          {description && <p className="panel-description">{description}</p>}

          <ActionButtons provider={provider} />

          <div className="panel-phone-info" dir="ltr">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#666"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span dir="ltr" style={{ unicodeBidi: 'embed' }}>{provider.phone}</span>
          </div>
        </div>
      </div>
    </>
  );
}
