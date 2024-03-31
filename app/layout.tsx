import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';

const theme = createTheme({
});

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <style>{`
          body {
            margin: auto;
            width: 85%;
          }
        `}</style>
      </head>
      <body>
        <MantineProvider theme={theme} forceColorScheme='dark'>{children}</MantineProvider>
      </body>
    </html>
  )
}
