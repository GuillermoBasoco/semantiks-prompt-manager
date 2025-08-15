import localFont from 'next/font/local'

export const aeonik = localFont({
  src: [
    { path: './Aeonik-Regular.ttf', weight: '400', style: 'normal' },
    { path: './Aeonik-Bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-aeonik',
  display: 'swap'
})


