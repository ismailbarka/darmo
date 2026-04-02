'use client';

import React from 'react';

export default function LoadingState() {
  return (
    <div className="state-container">
      <div className="loading-spinner" />
      <h2 className="loading-title">Finding services near you…</h2>
      <p className="loading-subtitle">This may take a moment</p>
    </div>
  );
}
