import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'

import '../globals.css';

export const metadata = {
  title: 'aigcgram',
  desscription: 'A community by AI-powered'
}

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <ClerkProvider
      // appearance={{
      //   baseTheme: dark,
      // }}
    >
      <html lang='en'>
        <body className={`${inter.className} bg-dark-1`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}