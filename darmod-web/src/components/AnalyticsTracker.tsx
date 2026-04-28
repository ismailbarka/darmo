"use client";

import { useEffect } from "react";
import { initMetaPixel, trackPageView } from "@/lib/analytics";

export default function AnalyticsTracker() {
  useEffect(() => {
    initMetaPixel();
    trackPageView();
  }, []);

  return null;
}