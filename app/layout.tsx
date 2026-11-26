import type { Metadata, Viewport } from "next";
import {
  IBM_Plex_Sans_Arabic,
  JetBrains_Mono,
  Plus_Jakarta_Sans,
  Syne,
} from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const jbMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jbmono",
  display: "swap",
});

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plex-ar",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mohamed Sameeh, product engineer",
  description:
    "Web apps, storefronts and AI agent systems, designed and built in English and Arabic.",
  openGraph: {
    title: "Mohamed Sameeh, product engineer",
    description:
      "Web apps, storefronts and AI agent systems, designed and built in English and Arabic.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#06070a",
  colorScheme: "dark",
};

/* Runs before first paint: picks the language from ?lang= or the last visit,
   so the document direction is right before any pixel is drawn. */
const bootScript = `(function(){try{var p=new URLSearchParams(location.search).get('lang');var s=localStorage.getItem('locale');var l=(p==='ar'||p==='en')?p:((s==='ar'||s==='en')?s:'en');var d=document.documentElement;d.lang=l;d.dir=l==='ar'?'rtl':'ltr';}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${syne.variable} ${jakarta.variable} ${jbMono.variable} ${plexArabic.variable} antialiased`}
    >
      <body className="min-h-dvh">
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        {children}
      </body>
    </html>
  );
}
