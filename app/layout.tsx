'use client'

import { MantineProvider, Switch, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import './globals.css'
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';

const theme = createTheme({
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [lightMode, { toggle }] = useDisclosure();

  return (
    <html lang="en">
      <head>
        <title>Typing champion</title>
      </head>
      <body>
        <MantineProvider theme={theme} forceColorScheme={lightMode ? 'light' : 'dark'}>
          <div style={{ margin: 'auto', width: '80%' }}>
            <h1><Link href="/" style={{ color: lightMode ? 'black' : 'white' }}>Typing champion ✍️</Link></h1>
            <Switch checked={lightMode} onChange={toggle} label="Light mode" mt="md" />
            {children}
          </div>
        </MantineProvider>
      </body>
    </html>
  )
}
