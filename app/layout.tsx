'use client'

import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import './globals.css'
import Link from 'next/link';

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
            <h1>
              <Link href="/" style={{ color: 'white' }}>Typing champion ✍️</Link>
            </h1>
            {children}
          </div>
        </MantineProvider>
      </body>
    </html>
  )
}
