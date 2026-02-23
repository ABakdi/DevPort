# DevPort - Complete Project Specification

## 1. Project Overview

### 1.1 Purpose
DevPort is a modern, open-source developer portfolio and blog platform that enables developers to:
- Showcase technical projects and expertise professionally
- Publish and manage technical blog content with superior code presentation
- Maintain a detailed, downloadable CV with multiple format options
- Manage all content through an intuitive admin dashboard without coding
- Fully customize the site's appearance, theme, and content for personal branding

### 1.2 Target Audience
- **Primary:** Full-stack developers, software engineers seeking a professional online presence
- **Secondary:** Open-source contributors looking for customizable templates
- **Tertiary:** Hiring managers and recruiters viewing developer portfolios

### 1.3 Project Scope (Included)
- Public-facing portfolio website (Home, Blog, About, CV, Projects, Articles)
- Complete admin dashboard with analytics and content management
- Light/Dark mode toggle on all pages
- CV generation with dual-format download (Visual + ATS-friendly)
- IDE-style syntax highlighted code blocks across all content
- Theme customization system (colors, animations, logo)
- Magic link authentication for admin access
- Newsletter subscription management
- Email inbox for contact form responses
- Full mobile responsiveness

### 1.4 Success Metrics
- Lighthouse Performance Score: ≥95
- Largest Contentful Paint (LCP): < 1.5 seconds
- Cumulative Layout Shift (CLS): < 0.1
- First Input Delay (FID): < 100ms
- Accessibility Score: 100
- SEO Score: 100
- Time to first deployment: < 15 minutes

---

## 2. Functional Requirements

### 2.1 Public Pages
| Page | Path | Description |
|------|------|-------------|
| Home | `/` | Landing page with terminal animation, featured projects, latest articles |
| Blog Archive | `/blog` | Searchable list of articles with filters and sidebar |
| Article Detail | `/blog/[slug]` | Full article with IDE-style code blocks, TOC, author bio |
| About | `/about` | Professional profile with experience timeline, skills, contact form |
| CV | `/cv` | Web-based CV with dual-format download modal |
| Projects | `/projects` | Filterable grid/list of all projects |
| Project Case Study | `/projects/[slug]` | Detailed project write-up with architecture, code, results |

### 2.2 Admin Pages
| Page | Path | Description |
|------|------|-------------|
| Admin Login | `/admin/login` | Email-based magic link authentication |
| Dashboard | `/admin` | Analytics overview with charts and key metrics |
| Article Editor | `/admin/articles/[id]/edit` | Split-screen markdown editor with live preview |
| Content Management | `/admin/content` | Unified interface for managing articles, projects, messages |
| Theme Customization | `/admin/theme` | Visual editor for colors, fonts, logo, animations |

### 2.3 Key Features
- Light/dark mode toggle with system preference detection
- Fully responsive design (mobile, tablet, desktop)
- IDE-style syntax-highlighted code blocks with copy functionality
- Newsletter subscription management
- Contact form with message inbox
- Download CV modal offering visual and ATS-friendly PDFs
- Google Search Console integration for SEO analytics

---

## 3. Technical Specifications

### 3.1 Technology Stack

| Layer          | Technology                                           |
| -------------- | ---------------------------------------------------- |
| Framework      | Next.js 16 (App Router) with React 19                |
| Language       | TypeScript                                           |
| UI Components  | shadcn/ui (accessible, composable)                   |
| Styling        | Tailwind CSS 4                                       |
| Animations     | Framer Motion                                        |
| Icons          | Lucide React                                         |
| Database       | MongoDB (latest) with Mongoose ODM                   |
| File Storage   | MinIO (S3-compatible, self-hosted via Docker)        |
| Authentication | NextAuth.js (email magic link, optional OAuth)       |
| Email          | Resend (transactional emails, free tier)             |
| Search         | TypeSense (self-hosted search engine)                |
| Analytics      | Umami (self-hosted) + Google Search Console          |
| Deployment     | Docker + Docker Compose on VPS, GitHub Actions CI/CD |

### 3.2 System Architecture
All services run in Docker containers on a single VPS, orchestrated by Docker Compose. A reverse proxy (Nginx) handles SSL termination with Let's Encrypt. The Next.js application connects to MongoDB, MinIO, and TypeSense internally. Umami provides privacy-friendly analytics.

### 3.3 Caching Strategy
- **Static Pages:** Generated at build time with Incremental Static Regeneration (ISR) – revalidated every hour.
- **API Routes:** Cache-Control headers set to `s-maxage=60, stale-while-revalidate`.
- **Images:** Next.js Image component with optimized caching and blur placeholders.
- **Browser Caching:** Static assets (JS, CSS) have long max-age with content hashing.
- **Database Queries:** Indexed for performance; no external cache layer required.

### 3.4 SEO Implementation
- Automatic sitemap generation at `/sitemap.xml`
- robots.txt with proper directives
- Structured data (JSON-LD): Article, CreativeWork, Person, BreadcrumbList
- Open Graph and Twitter Card meta tags
- Canonical URLs
- Semantic HTML with proper heading hierarchy
- Editable meta titles and descriptions per article/project
- Image alt text enforced

### 3.5 Performance Targets
- Lighthouse Performance: ≥95
- LCP: < 1.5s
- CLS: < 0.1
- FID: < 100ms
- Time to Interactive: < 2.5s

### 3.6 Browser Support
- Chrome, Firefox, Safari, Edge (latest 2 versions)
- Mobile: iOS Safari, Android Chrome

### 3.7 Security
- Magic link authentication (no password storage)
- JWT stored in HTTP-only cookies (15-minute expiry)
- Rate limiting on login and contact forms
- Helmet.js for security headers
- Input validation with Zod
- XSS protection via Content Security Policy and DOMPurify
- HTTPS enforced with Let's Encrypt

---

## 4. Design & Content

### 4.1 Design Philosophy
- Modern, minimal, tech-focused with vibrant accents
- Clean layouts with purposeful whitespace
- Content-first typography optimized for readability
- Consistent design language across all pages
- Fully customizable via admin panel (colors, fonts, logo, animations)

### 4.2 Page Descriptions (UI/UX)

#### 4.2.1 Home Page
A sticky navigation bar includes logo, navigation links (Home, Blog, Projects, About, CV), a theme toggle button, and a prominent "Download CV" button. The hero section is split into two columns: left column contains a greeting, an animated terminal-style typing headline that cycles through developer roles (e.g., "Full-Stack Developer"), a short bio, and two call-to-action buttons ("View My Work" and "Contact Me"). The right column features an abstract tech visualization or developer illustration with subtle floating animation.

Below the hero, a tech stack section displays a row of technology icons that turn from grayscale to the accent color on hover, with tooltips revealing the technology name. Next, a featured projects section shows three project cards in a grid. Each card includes a project image, title, brief description, and small technology tag pills. Cards have a hover effect that slightly lifts them and adds a border in the accent color.

Below the projects, a latest articles section displays three article cards, each with a category badge, title, excerpt, metadata (reading time and date), and a "Read article" link. The page ends with a footer containing copyright information, quick links, and social media icons.

#### 4.2.2 Blog Archive
The blog archive page starts with a page title "Blog". Below it, a search bar allows users to search articles by title or content. Category filters are presented as a horizontal scrollable row of pill-shaped buttons (e.g., All, React, Node.js, TypeScript). A sort dropdown lets users order articles by newest, oldest, most popular, or longest read.

The main content area is split into two columns. The left column (wider) contains a grid of article cards (two columns). Each card includes a featured image, category badge, title, excerpt, and metadata (reading time and date). The right column (sidebar) contains a "Popular Posts" widget listing the most-read articles and a newsletter signup widget with an email input and subscribe button. At the bottom, pagination controls allow navigation through multiple pages.

#### 4.2.3 Article Detail
The article detail page begins with a breadcrumb navigation (e.g., Blog > Category > Article Title). The article header displays the title, author avatar and name, publish date, reading time, and share buttons (Twitter, LinkedIn, copy link).

Below the header, the page uses a two-column layout. On the left, a sticky table of contents auto-generated from the article's headings (H2 and H3) allows quick navigation. The right column contains the main article content with a maximum width for optimal readability. Typography is carefully spaced: paragraphs have adequate margins, headings stand out, lists are well-formatted, and blockquotes have a left accent border.

Code blocks are presented in an IDE-like style: a header shows the language and a copy button, the code area has line numbers, syntax highlighting, and horizontal scroll for long lines. Inline code is styled differently from body text.

After the content, an author bio section displays the author's avatar, name, short bio, and social links. A newsletter signup form invites readers to subscribe for future posts. Finally, next/previous article navigation links help users discover more content.

#### 4.2.4 About Page
The about page opens with a hero section featuring a profile photo, name, professional title, a short bio, and a "Download CV" button. Below that, a work experience timeline presents jobs in reverse chronological order. Each experience entry includes the company logo, role, company name, dates, location, and bullet points of achievements, with metrics highlighted where possible.

A skills matrix follows, organized into tabs for different categories (Frontend, Backend, DevOps, Tools). Each skill shows the name with an icon, a visual proficiency indicator, and years of experience.

The contact section is split into two columns. The left column lists direct contact methods: email with a copy option, phone (optional), location with timezone, and social media icon links. The right column contains a contact form with fields for name, email, subject, and message, and a submit button. Finally, an education and languages section shows degrees and language proficiencies in a two-column layout.

#### 4.2.5 CV Page
The CV page features a prominent "Download CV" button near the top. When clicked, it opens a modal dialog offering two download options: a "Visual CV" (full design, colors, layout with photo) and an "ATS-Friendly CV" (plain text, no images, optimized for applicant tracking systems). The modal includes descriptive text for each option and a download button.

The CV content itself is structured like a traditional resume. At the top, a header displays the person's name, title, and contact information (email, phone, location) with icons. A professional summary follows.

Below, a two-column layout presents work experience (left column) and skills/education/languages (right column). Work experience entries include company name, location, role, dates, and bullet points with achievements. Skills are grouped by category and shown as tags. Education includes degree, institution, and year. Languages list each language with proficiency level. The page is designed to print cleanly with appropriate media queries.

#### 4.2.6 Projects Page
The projects page begins with a title "Projects" and a filter bar that allows users to filter by technology, year, and sort order. A view toggle lets users switch between grid and list layouts.

In grid view, projects are displayed in a three-column grid. Each project card includes a thumbnail image, title, brief description, small technology tags, and icon links for live demo and GitHub repository. Cards have a hover effect that slightly scales them and adds shadow.

In list view, projects appear in a single column with a horizontal card layout: a small square image on the left, and title, description, tags, and links on the right, making it easier to scan multiple projects. Pagination controls at the bottom allow navigation through multiple pages.

#### 4.2.7 Project Case Study
The project case study page provides an in-depth look at a particular project. It starts with a hero section showing the project title, role, timeline, team size, and primary technology tags. A problem statement section describes the challenge in one or two paragraphs.

A solution architecture section includes a placeholder for a system diagram (interactive zoom suggested) and key technical decisions explained in bullet points. A tech stack grid displays the technologies used, each with an icon, name, and brief description of its role.

Implementation highlights feature code snippets (styled like IDE code blocks) with explanations, technical challenges faced and how they were solved, and performance optimizations applied. A results section presents key metrics in cards (e.g., "40% faster load times") along with screenshots or GIFs of the final product. Finally, links to the GitHub repository, live demo, and a downloadable case study PDF are provided as buttons.

#### 4.2.8 Admin Login
The admin login page is minimal and centered. It displays the site logo at the top, followed by a login card. The card contains a welcome message, an email input field, and a "Send Magic Link" button. Below the button, helper text explains that a secure link will be emailed and expires in 15 minutes. The page shows different states: default, sending (button disabled with spinner), success (message indicating email sent), and error (message with retry option). Footer links may include a link back to the public site.

#### 4.2.9 Admin Dashboard
The admin dashboard is accessed after login and features a persistent sidebar navigation on the left with icons and labels for Dashboard, Articles, Projects, Profile, Messages, Theme, and Settings. The main content area occupies the rest of the screen.

At the top of the main area, a greeting (e.g., "Good morning, [Name]") and the current date are displayed. Below that, four stat cards show key metrics: total visitors, article reads, CV downloads, and newsletter subscribers. Each card includes an icon, label, large number, and percentage change with trend indicator.

A traffic overview chart (line chart) with date range filters shows visitor trends. Below that, two columns present top articles (list with titles and views) and traffic sources (pie/donut chart with legend). Quick action buttons (New Article, Edit Profile, View Site, Customize Theme) are placed at the bottom for easy access.

#### 4.2.10 Article Editor
The article editor page uses a split-screen layout. The left side is a markdown editor with syntax highlighting and line numbers. The right side shows a live preview of the rendered article, matching the public article page appearance.

Above the split view, an editor header displays the article title input, status indicator (draft/published), and save/publish buttons. A toolbar with formatting shortcuts (bold, italic, heading, code, link, image, etc.) is attached to the editor.

Below the split view, a metadata panel can be expanded/collapsed. It contains fields for the article slug, excerpt, featured image upload, category selection, SEO title and description, and publish scheduling options.

#### 4.2.11 Content Management
The content management page uses a tabbed interface to switch between managing articles, projects, profile, and messages. Each tab presents a list view with search and filter capabilities.

For articles and projects, the list shows titles, status (draft/published), last modified date, and actions (edit, delete, duplicate). Checkboxes allow bulk operations. Columns are sortable. For messages, the list shows sender, subject, date, and read/unread status; clicking a message opens it in a detail view with reply functionality.

The profile tab may show a preview of the about page with inline editing options. Pagination controls appear at the bottom of lists.

#### 4.2.12 Theme Customization
The theme customization page allows users to modify the site's appearance through a visual interface. The page is split into a settings panel on the left and a live preview of the public site on the right (embedded in an iframe or simulated view).

The settings panel includes sections:
- **Color Palette:** Color pickers for primary, secondary, accent, background, surface, and text colors, with separate controls for light and dark mode.
- **Typography:** Font family dropdown (Google Fonts integration) and size sliders for headings and body text.
- **Logo:** Upload area for logo (SVG/PNG) with preview and favicon generation.
- **Animations:** Toggles to enable/disable specific animations and a speed slider.
- **Theme Presets:** Buttons to apply pre-built themes (Modern, Minimal, Dark, Cyberpunk).
- **Export/Import:** Buttons to save current theme as JSON or load a previously exported theme.

The live preview updates in real-time as settings are changed, allowing users to see the effect immediately.

---

## 5. Non-Functional Requirements

### 5.1 Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation with visible focus indicators
- Screen reader support (ARIA labels, semantic HTML)
- Color contrast ratio ≥ 4.5:1
- Reduced motion preference respected

### 5.2 Analytics & Tracking
- Umami (self-hosted) for privacy-friendly analytics
- Google Search Console integration for SEO insights
- Event tracking (optional, can be disabled): page views, article reads, CV downloads, code block copies, theme toggles

### 5.3 Open Source Requirements
- **License:** MIT
- **Documentation:** README with setup instructions, configuration guide, customization guide, deployment guides
- **Customization Points:** Colors, fonts, logo, animations, email templates, PDF CV templates
- **One-command setup:** `docker-compose up` with environment variables

---

## 6. Deployment

### 6.1 Docker Compose Configuration
The project includes a `docker-compose.yml` that defines:
- `app`: Next.js application (built from Dockerfile)
- `mongodb`: MongoDB container with persistent volume
- `minio`: MinIO S3-compatible storage
- `typesense`: TypeSense search engine
- `umami`: Umami analytics (optional)
- `nginx`: Reverse proxy with Let's Encrypt SSL (optional but recommended)

### 6.2 CI/CD with GitHub Actions
- On push to `main`: run tests, build Docker images, push to container registry (GitHub Container Registry or Docker Hub), then SSH into VPS and deploy with `docker-compose pull && docker-compose up -d`.
- Secrets stored in GitHub: SSH key, environment variables.

### 6.3 Environment Variables
All sensitive values are passed via `.env` file (not committed). Example provided in `.env.example`.

### 6.4 Alternative Deployment
- **Vercel:** One-click deploy (frontend only, requires external MongoDB, MinIO, etc.)
- **Manual:** Build and run with Node.js directly (not recommended)

---

## 7. Project Roadmap

### Phase 1 (MVP)
- All public pages as described
- Admin dashboard with basic analytics and content management
- Magic link authentication
- Markdown editor with live preview
- Theme customization (colors, fonts, logo)
- CV download modal
- Docker Compose setup

### Phase 2 (Future Enhancements)
- Multi-language support
- Comments system (via GitHub issues or Giscus)
- More analytics integrations
- Email campaign automation
- Social media auto-posting
- Dark/light mode toggle in admin preview

