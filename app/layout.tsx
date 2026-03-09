import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import { ThemeContextProvider } from "@/lib/theme-context";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevPort - Abderrhmane Bakdi | Full Stack Architect",
  description: "Full Stack Developer | System Architect | Product Engineer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme-current');
                  if (stored) {
                    var theme = JSON.parse(stored);
                    if (theme.background) {
                      document.documentElement.style.setProperty('--theme-primary', theme.primary);
                      document.documentElement.style.setProperty('--theme-secondary', theme.secondary);
                      document.documentElement.style.setProperty('--theme-accent', theme.accent);
                      document.documentElement.style.setProperty('--theme-background', theme.background);
                      document.documentElement.style.setProperty('--theme-surface', theme.surface);
                      document.documentElement.style.setProperty('--theme-text', theme.text);
                      document.documentElement.style.setProperty('--theme-page-style', theme.pageStyle || 'default');
                      
                      // Apply page style as data attribute for CSS
                      var pageStyle = theme.pageStyle || 'default';
                      document.documentElement.setAttribute('data-page-style', pageStyle);
                      
                      // Apply background for page styles
                      if (pageStyle && pageStyle !== 'default') {
                        var gradients = {
                          bento: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                          minimalist: '#fafafa',
                          neobrutalist: '#FFE66D',
                          glass: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          cyberpunk: '#050505',
                          soft: 'linear-gradient(135deg, #a78bfa 0%, #f472b6 50%, #fb923c 100%)',
                          tech: '#0d1117',
                          organic: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
                        };
                        if (gradients[pageStyle]) {
                          document.body.style.background = gradients[pageStyle];
                        }
                      }
                    }
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${firaCode.variable} antialiased`}>
        <ThemeContextProvider>
          {children}
        </ThemeContextProvider>
      </body>
    </html>
  );
}
