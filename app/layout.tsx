import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Tajawal, Cairo } from 'next/font/google'
import { AuthProvider } from '@/contexts/auth-context'
import { DataProvider } from '@/contexts/data-context'
import './globals.css'

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '500', '700'],
  variable: '--font-tajawal',
})

const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['600', '700', '800'],
  variable: '--font-cairo',
})

export const metadata: Metadata = {
  title: 'مدرسة بني قدامة لتحفيظ القران لتحفيظ القرآن الكريم',
  description: 'منصة متكاملة لإدارة حلقات تحفيظ القرآن الكريم للمحفظين والطلاب',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#115e59',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className="bg-background">
      <body className={`${tajawal.variable} ${cairo.variable} font-sans antialiased`}>
        <DataProvider>
          <AuthProvider>{children}</AuthProvider>
        </DataProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
