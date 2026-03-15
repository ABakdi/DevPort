import type { Metadata } from "next";
import { 
  Inter, Fira_Code, Poppins, Outfit, Sora, 
  Plus_Jakarta_Sans, Manrope, JetBrains_Mono,
  Source_Code_Pro, Space_Mono, IBM_Plex_Mono,
  Playfair_Display, Merriweather, Lora
} from "next/font/google";
import "./globals.css";
import { ThemeContextProvider } from "@/lib/theme-context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"],
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
                // Font mapping - must match theme-context.tsx
                var fontMap = {
                  'Inter': 'var(--font-inter)',
                  'Poppins': 'var(--font-poppins)',
                  'Outfit': 'var(--font-outfit)',
                  'Sora': 'var(--font-sora)',
                  'Plus Jakarta Sans': 'var(--font-plus-jakarta-sans)',
                  'Manrope': 'var(--font-manrope)',
                  'JetBrains Mono': 'var(--font-jetbrains-mono)',
                  'Fira Code': 'var(--font-fira-code)',
                  'Source Code Pro': 'var(--font-source-code-pro)',
                  'Space Mono': 'var(--font-space-mono)',
                  'IBM Plex Mono': 'var(--font-ibm-plex-mono)',
                  'Playfair Display': 'var(--font-playfair-display)',
                  'Merriweather': 'var(--font-merriweather)',
                  'Lora': 'var(--font-lora)',
                };
                
                function applyTheme(theme) {
                  console.log('applyTheme called with:', theme);
                  
                  // Apply fonts - these work independently of colors
                  var fontHeading = theme.fontHeading || 'Inter';
                  var fontBody = theme.fontBody || 'Inter';
                  var fontSize = theme.fontSize || 16;
                  
                  console.log('Applying fontHeading:', fontHeading, '->', fontMap[fontHeading]);
                  console.log('Applying fontBody:', fontBody, '->', fontMap[fontBody]);
                  console.log('Applying fontSize:', fontSize);
                  
                  document.documentElement.style.setProperty('--theme-font-heading', fontMap[fontHeading] || 'var(--font-inter)');
                  document.documentElement.style.setProperty('--theme-font-body', fontMap[fontBody] || 'var(--font-inter)');
                  document.documentElement.style.setProperty('--theme-font-size', fontSize + 'px');
                  
                  // Apply colors
                  if (theme.background) {
                    document.documentElement.style.setProperty('--theme-primary', theme.primary);
                    document.documentElement.style.setProperty('--theme-secondary', theme.secondary);
                    document.documentElement.style.setProperty('--theme-accent', theme.accent);
                    document.documentElement.style.setProperty('--theme-background', theme.background);
                    document.documentElement.style.setProperty('--theme-surface', theme.surface);
                    document.documentElement.style.setProperty('--theme-text', theme.text);
                    
                    if (theme.pageStyle) {
                      document.documentElement.setAttribute('data-page-style', theme.pageStyle);
                      var pageStyle = theme.pageStyle;
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
                  
                  // Save to localStorage for consistency
                  localStorage.setItem('theme-current', JSON.stringify(theme));
                }
                
                // Try localStorage first (sync)
                var stored = localStorage.getItem('theme-current');
                if (stored) {
                  try {
                    var theme = JSON.parse(stored);
                    console.log('Found theme in localStorage:', theme);
                    applyTheme(theme);
                  } catch(e) {
                    console.error('Error parsing localStorage theme:', e);
                  }
                } else {
                  console.log('No theme in localStorage, will fetch from API');
                }
                
                // Also fetch from API to ensure we have latest (async)
                var apiFetch = function() {
                  fetch('/api/theme?t=' + Date.now())
                    .then(function(res) { return res.json(); })
                    .then(function(data) {
                      console.log('Got theme from API:', data);
                      if (data && (data.fontHeading || data.fontBody)) {
                        applyTheme(data);
                      }
                    })
                    .catch(function(e) {
                      console.error('Error fetching theme from API:', e);
                    });
                };
                
                // Small delay to not block render
                setTimeout(apiFetch, 0);
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${firaCode.variable} ${poppins.variable} ${outfit.variable} ${sora.variable} ${plusJakartaSans.variable} ${manrope.variable} ${jetbrainsMono.variable} ${sourceCodePro.variable} ${spaceMono.variable} ${ibmPlexMono.variable} ${playfairDisplay.variable} ${merriweather.variable} ${lora.variable} antialiased`}
        suppressHydrationWarning
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Immediate font application - runs before anything else
              (function() {
                var fontMap = {
                  'Inter': 'var(--font-inter)',
                  'Poppins': 'var(--font-poppins)',
                  'Outfit': 'var(--font-outfit)',
                  'Sora': 'var(--font-sora)',
                  'Plus Jakarta Sans': 'var(--font-plus-jakarta-sans)',
                  'Manrope': 'var(--font-manrope)',
                  'JetBrains Mono': 'var(--font-jetbrains-mono)',
                  'Fira Code': 'var(--font-fira-code)',
                  'Source Code Pro': 'var(--font-source-code-pro)',
                  'Space Mono': 'var(--font-space-mono)',
                  'IBM Plex Mono': 'var(--font-ibm-plex-mono)',
                  'Playfair Display': 'var(--font-playfair-display)',
                  'Merriweather': 'var(--font-merriweather)',
                  'Lora': 'var(--font-lora)',
                };
                
                function applyFonts(theme) {
                  if (!theme) return;
                  var fh = theme.fontHeading || 'Inter';
                  var fb = theme.fontBody || 'Inter';
                  console.log('BODY SCRIPT - Applying fonts:', fh, fb);
                  document.documentElement.style.setProperty('--theme-font-heading', fontMap[fh] || 'var(--font-inter)');
                  document.documentElement.style.setProperty('--theme-font-body', fontMap[fb] || 'var(--font-inter)');
                  document.body.style.fontFamily = fontMap[fb] || 'var(--font-inter)';
                }
                
                // Try to get from localStorage
                try {
                  var stored = localStorage.getItem('theme-current');
                  if (stored) {
                    var theme = JSON.parse(stored);
                    applyFonts(theme);
                  }
                } catch(e) {
                  console.log('BODY SCRIPT - Error:', e);
                }
                
                // Listen for theme changes
                window.addEventListener('storage', function(e) {
                  if (e.key === 'theme-current' && e.newValue) {
                    applyFonts(JSON.parse(e.newValue));
                  }
                });
                
                // Also listen for custom theme-changed event
                window.addEventListener('theme-changed', function(e) {
                  applyFonts(e.detail);
                });
              })();
            `
          }}
        />
        <ThemeContextProvider>
          {children}
        </ThemeContextProvider>
      </body>
    </html>
  );
}
