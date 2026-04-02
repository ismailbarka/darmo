'use client';

import React from 'react';
import Image from 'next/image';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  return (
    <header className="app-header">
      <div className="app-header-content">
        <div className="header-logo">
          <Image
            src="/icon.png"
            alt="Daro Logo"
            width={32}
            height={32}
            className="logo-icon"
          />
          <span className="logo-text">Daro.ma</span>
        </div>
        <div className="header-actions">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
