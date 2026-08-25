import "./globals.css";

export const metadata = {
  title: "Himo — Your creative intelligence",
  description: "Chat, code, and bring your ideas to life with Himo."
};

export default function RootLayout({ children }) {
  return <html lang="en" className="app-html"><body>{children}</body></html>;
}
