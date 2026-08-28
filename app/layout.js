export const metadata = {
  title: 'Himo',
  description: 'Himo - Web Search & Code Extractor',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#020617' }}>
        {children}
      </body>
    </html>
  );
}
