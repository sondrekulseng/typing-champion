'use client'

import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import './globals.css'
import Link from 'next/link';
import AnalyticsProvider from '../providers/AnalyticsProvider';
import { useEffect, useState } from 'react';
import CookieModal from '@/components/modals/CookieModal';

const theme = createTheme({
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const [showCookieConsentModal, setShowCookieConsentModal] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('cookiesConsented')) {
      setShowCookieConsentModal(false);
    }
  }, [])

  if (showCookieConsentModal) {
    return (
      <html lang='en'>
        <head>
          <title>Typing champion</title>
          <link rel='icon' type='image/x-icon' href='/favicon.ico' />
        </head>
        <body>
          <MantineProvider theme={theme} forceColorScheme={'dark'}>
            <CookieModal open={showCookieConsentModal} setOpen={setShowCookieConsentModal} />
            <div style={{ margin: 'auto', width: '80%' }}>
              <h1>
                <Link href="/" style={{ color: 'white' }}>Typing champion ✍️</Link>
              </h1>
            </div>
          </MantineProvider>
        </body>
      </html>
    )
  }

  return (
    <html lang='en'>
      <head>
        <title>Typing champion</title>
        <link rel='icon' type='image/x-icon' href='/favicon.ico' />
      </head>
      <body>
        <MantineProvider theme={theme} forceColorScheme={'dark'}>
          <AnalyticsProvider>
            <div style={{ margin: 'auto', width: '80%' }}>
              <h1>
                <Link href="/" style={{ color: 'white' }}>Typing champion ✍️</Link>
              </h1>
              {children}
            </div>
          </AnalyticsProvider>
        </MantineProvider>
      </body>
    </html>
  )
}
