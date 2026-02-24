# DevPort - Prompt History

This file tracks all changes, features, and fixes implemented in the DevPort project.

---

## Project Context

You are working on **DevPort**, a modern, open-source developer portfolio and blog platform.

### Quick Summary
- **Type:** Full-stack web application (Next.js 16 App Router)
- **Purpose:** Developer portfolio with blog, projects showcase, CV generation, and admin dashboard
- **Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, Framer Motion, MongoDB, NextAuth.js, Docker
- **Key Features:** Light/dark mode, IDE-style code blocks, magic link auth, theme customization, CV download modal, newsletter, contact form

### Documentation
For detailed specifications, see: `docs/specs.md`

---

## Implementation Log

### [Unreleased]

#### Features
- **Home Page**: Complete home page implementation matching design spec from `docs/home.html`
  - Sticky navbar with logo, navigation links, theme toggle, and CV download button
  - Profile card with avatar, "Ready_For_Hire" status, skills tags, location, and contact CTA
  - About section with bio, achievements, and team avatars
  - Case study section showcasing Enterprise Data Lake Engine project
  - Interactive terminal section displaying stats and recent thoughts
  - Toolbox grid with tech stack icons
  - Recent articles section with blog post previews
  - Footer with social links and version info

- **Theme System**: Dark/light mode toggle with persistence
  - ThemeProvider context with localStorage persistence
  - System preference detection
  - Server-side dark mode default with client-side toggle
  - Smooth transitions between themes

- **UI Components**: Base component library
  - Button component with multiple variants (shadcn/ui style)
  - Tooltip component using Radix UI primitives
  - cn utility for Tailwind class merging

#### Dependencies Added
- UI: @radix-ui/react-* (dialog, dropdown, tooltip, etc.)
- Animation: framer-motion
- State: zustand
- Forms: react-hook-form, @hookform/resolvers, zod
- Data: @tanstack/react-query
- Charts: recharts
- Markdown: @mdx-js/*, remark-gfm, rehype-highlight
- Auth: next-auth
- Database: mongoose
- Utilities: clsx, tailwind-merge, class-variance-authority, date-fns

---

### v0.1.0 (2024-01-01)
- Initial project setup with Next.js 16
- Created specification document and changelog
