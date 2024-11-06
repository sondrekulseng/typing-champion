'use client'

import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import './globals.css'
import Header from '@/components/header/Header';

const theme = createTheme({});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang='en'>
      <head>
        <title>Typing champion</title>
        <link rel='icon' type='image/x-icon' href='/favicon.ico' />
      </head>
      <body>
        <MantineProvider theme={theme} forceColorScheme={'dark'}>
          <div style={{ margin: 'auto', width: '80%' }}>
            <Header />
            {children}
          </div>
        </MantineProvider>
      </body>
    </html>
  )
}