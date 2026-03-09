import {
  Navbar,
  ProfileCard,
  AboutSection,
  TerminalSection,
  Toolbox,
  RecentArticles,
  Footer,
  CaseStudy,
  ThemeDebug,
} from "@/components/home"
import { getProfileData } from "@/lib/profile"

export const revalidate = 0

export default async function Home() {
  const profile = await getProfileData()

  const defaultProfile = {
    name: "",
    title: "",
    location: "",
    timezone: "Africa/Algiers",
    email: "",
    skills: [] as string[],
    bio: "",
    achievements: [] as string[],
    techStack: [] as string[],
    social: { twitter: "", github: "", linkedin: "", youtube: "", instagram: "" },
    siteVersion: "v2024.1.0-alpha",
    showHero: true,
    showProfileCard: true,
    showAbout: true,
    showTerminal: true,
    showToolbox: true,
    showFeaturedProjects: true,
    showRecentArticles: true,
    showFooter: true,
  }

  const p = profile ? {
    ...defaultProfile,
    ...profile,
    social: (profile as { social?: typeof defaultProfile.social }).social ? { ...defaultProfile.social, ...(profile as { social?: typeof defaultProfile.social }).social } : defaultProfile.social,
    showHero: profile.showHero ?? defaultProfile.showHero,
    showProfileCard: profile.showProfileCard ?? defaultProfile.showProfileCard,
    showAbout: profile.showAbout ?? defaultProfile.showAbout,
    showTerminal: profile.showTerminal ?? defaultProfile.showTerminal,
    showToolbox: profile.showToolbox ?? defaultProfile.showToolbox,
    showFeaturedProjects: profile.showFeaturedProjects ?? defaultProfile.showFeaturedProjects,
    showRecentArticles: profile.showRecentArticles ?? defaultProfile.showRecentArticles,
    showFooter: profile.showFooter ?? defaultProfile.showFooter,
  } : defaultProfile

  const hasAnySection = p.showHero || p.showProfileCard || p.showAbout || p.showTerminal || p.showToolbox || p.showFeaturedProjects || p.showRecentArticles || p.showFooter

  return (
    <div className="min-h-screen">
      <ThemeDebug />
      <Navbar />
      {!hasAnySection ? (
        <main className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-slate-400 mb-2">No Sections Enabled</h1>
            <p className="text-slate-500">Enable at least one section from the admin panel to display content.</p>
          </div>
        </main>
      ) : (
        <main className="max-w-7xl mx-auto px-6 py-8 space-y-6 pt-16">
        {p.showHero && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {p.showProfileCard && (
              <div className="lg:col-span-4">
                <ProfileCard profile={p} />
              </div>
            )}
            {p.showAbout && (
              <div className={p.showProfileCard ? "lg:col-span-8" : "lg:col-span-12"}>
                <AboutSection bio={p.bio} achievements={p.achievements} />
              </div>
            )}
          </div>
        )}

        {!p.showHero && (p.showProfileCard || p.showAbout) && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {p.showProfileCard && (
              <div className="lg:col-span-4">
                <ProfileCard profile={p} />
              </div>
            )}
            {p.showAbout && (
              <div className={p.showProfileCard ? "lg:col-span-8" : "lg:col-span-12"}>
                <AboutSection bio={p.bio} achievements={p.achievements} />
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {p.showTerminal && (
            <div className="lg:col-span-7">
              <TerminalSection />
            </div>
          )}
          <div className="lg:col-span-5 space-y-6">
            {p.showToolbox && <Toolbox techStack={p.techStack} />}
            {p.showRecentArticles && <RecentArticles />}
          </div>
        </div>

        {p.showFeaturedProjects && (
          <CaseStudy caseStudy={profile?.caseStudy} />
        )}

        {p.showFooter && <Footer social={p.social} siteVersion={p.siteVersion} />}
        </main>
      )}
    </div>
  )
}
