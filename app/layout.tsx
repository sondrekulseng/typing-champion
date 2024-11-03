'use client'

import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import './globals.css'
import Link from 'next/link';
import AnalyticsProvider from './providers/AnalyticsProvider';

const theme = createTheme({
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <head>
        <title>Typing champion</title>
      </head>
      <body>
        <MantineProvider theme={theme} forceColorScheme={'dark'}>
          <AnalyticsProvider>
            <div style={{ margin: 'auto', width: '80%' }}>
              <h1><Link href="/" style={{ color: 'white' }}>Typing champion ✍️</Link></h1>
              {children}
            </div>
          </AnalyticsProvider>
        </MantineProvider>
      </body>
    </html>
  )
}
