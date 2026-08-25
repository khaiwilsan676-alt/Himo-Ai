import "./globals.css";

export const metadata = {
  title: "hi Himo — Your creative intelligence",
  description: "Chat, code, and bring your ideas to life with hi Himo.",
  icons: {
    icon: "/logo.png"
  }
};

export default function RootLayout({ children }) {
  return <html lang="en" className="app-html"><body>{children}</body></html>;
}
