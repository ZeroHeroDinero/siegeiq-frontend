export const metadata = {
  title: 'SiegeIQ — AI Coaching for Rainbow Six Siege',
  description: 'Upload your gameplay clip. Get timestamped AI coaching in minutes.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
