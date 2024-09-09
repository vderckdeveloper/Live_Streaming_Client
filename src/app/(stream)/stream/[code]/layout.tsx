// global style
import "@/styles/globals.css";

export const metadata = {
  title: 'Edu Meet | 스트리밍',
  description: 'Edu Meet Streaming Page',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
