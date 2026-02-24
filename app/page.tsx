import {
  Navbar,
  ProfileCard,
  AboutSection,
  CaseStudy,
  TerminalSection,
  Toolbox,
  RecentArticles,
  Footer,
} from "@/components/home"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <ProfileCard />
          </div>
          <div className="lg:col-span-8">
            <AboutSection />
          </div>
        </div>

        <CaseStudy />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <TerminalSection />
          </div>
          <div className="lg:col-span-5 space-y-6">
            <Toolbox />
            <RecentArticles />
          </div>
        </div>

        <Footer />
      </main>
    </div>
  )
}
