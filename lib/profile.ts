import { connectToDatabase } from "@/lib/mongodb"
import { Profile } from "@/models/profile"

export async function getProfileData() {
  try {
    await connectToDatabase()
    let profile = await Profile.findOne()

    if (!profile) {
      profile = await Profile.create({
        name: "Abderrhmane Bakdi",
        title: "Full Stack Architect",
        subtitle: "",
        bio: "My passion for engineering goes back to the era of assembly and early web protocols. Today I architect high-performance SaaS solutions that bridge the gap between user experience and system integrity.",
        location: "Algiers, DZ",
        timezone: "CET",
        email: "hello@abakdi.dev",
        phone: "",
        skills: ["Full Stack Dev", "System Architect", "Product Engineer"],
        achievements: [
          "Architected microservices handling 2M+ daily requests.",
          "Reduced infrastructure costs by 40% using serverless patterns.",
          "Leading engineering teams in high-growth startups.",
        ],
        techStack: ["NodeJS", "TypeScript", "K8s", "AWS", "Go", "React", "Python", "Docker"],
        caseStudy: {
          title: "Enterprise Data Lake Engine",
          description: "A proprietary data ingestion engine designed for high-throughput financial transactions.",
          stats: {
            latency: "4.2ms",
            processed: "128TB+",
          },
        },
        siteVersion: "v2024.1.0-alpha",
        showHero: true,
        showProfileCard: true,
        showAbout: true,
        showTerminal: true,
        showToolbox: true,
        showFeaturedProjects: true,
        showRecentArticles: true,
        showFooter: true,
      })
    }

    const profileObj = JSON.parse(JSON.stringify(profile))
    
    return {
      name: profileObj.name ?? "",
      title: profileObj.title ?? "",
      bio: profileObj.bio ?? "",
      location: profileObj.location ?? "",
      timezone: profileObj.timezone ?? "Africa/Algiers",
      email: profileObj.email ?? "",
      phone: profileObj.phone ?? "",
      skills: profileObj.skills ?? [],
      achievements: profileObj.achievements ?? [],
      techStack: profileObj.techStack ?? [],
      socialLinks: profileObj.socialLinks ?? [],
      siteVersion: profileObj.siteVersion ?? "v2024.1.0-alpha",
      caseStudy: profileObj.caseStudy,
      showHero: profileObj.showHero === true || profileObj.showHero === false ? profileObj.showHero : true,
      showProfileCard: profileObj.showProfileCard === true || profileObj.showProfileCard === false ? profileObj.showProfileCard : true,
      showAbout: profileObj.showAbout === true || profileObj.showAbout === false ? profileObj.showAbout : true,
      showTerminal: profileObj.showTerminal === true || profileObj.showTerminal === false ? profileObj.showTerminal : true,
      showToolbox: profileObj.showToolbox === true || profileObj.showToolbox === false ? profileObj.showToolbox : true,
      showFeaturedProjects: profileObj.showFeaturedProjects === true || profileObj.showFeaturedProjects === false ? profileObj.showFeaturedProjects : true,
      showRecentArticles: profileObj.showRecentArticles === true || profileObj.showRecentArticles === false ? profileObj.showRecentArticles : true,
      showFooter: profileObj.showFooter === true || profileObj.showFooter === false ? profileObj.showFooter : true,
    }
  } catch (error) {
    console.error("Error fetching profile:", error)
    return null
  }
}
