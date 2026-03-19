# DevPort - Changelog

This file tracks all changes, features, and fixes implemented in the DevPort project.

---

## Project Overview

**DevPort** is a modern, open-source developer portfolio and blog platform built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui, Framer Motion, MongoDB, and NextAuth.js.

### Quick Summary
- **Type:** Full-stack web application
- **Purpose:** Developer portfolio with blog, projects showcase, CV generation, and admin dashboard
- **Key Features:** Light/dark mode, IDE-style code blocks, magic link auth, theme customization, CV download modal, newsletter, contact form

### Documentation
For detailed specifications, see: `docs/specs.md`

---

## Implementation Log

### [Unreleased]

#### Features

**CV System**
- Public CV page at `/cv` displaying resume with work experience, education, skills, languages, certifications
- CV model with MongoDB schema for resume data management
- CV API route (GET/PUT) for resume data
- Admin CV management page at `/admin/cv` with full resume editing interface
- CV download button component for navbar
- CV profile picture upload with size options (35x45mm or 51x51mm)
- Picture display in CV preview and downloads (positioned on right of professional summary)

**Contact Form & Messages**
- Message model for storing contact form submissions in MongoDB
- Messages API routes (GET/POST/DELETE/PUT) with filtering (all/unread/starred/replied)
- Admin messages page with:
  - Stats dashboard (total, unread, starred, replied)
  - Search and filter functionality
  - Message detail view
  - Reply functionality with email integration
  - Delete messages
- Contact section component for home page
- Public contact form

**Blog Enhancements**
- Complete redesign of blog page
- Featured article section with large hero card
- Stats display (total articles, categories, minutes read)
- Category filter pills
- Newsletter signup CTA section
- Breadcrumb navigation
- Gradient backgrounds and glow effects
- Featured image with hover gradient overlay
- Reading time and date display

**Theme System Enhancements**
- Theme Background System with 10 styles: None, Gradient, Grid, Network, Particles, Space, Retro, Waves, Aurora, Mesh
- Custom image upload support
- Custom video background support
- useBackground hook for consistent theme-driven backgrounds
- AnimatedBackground component on home page
- Admin layout with theme backgrounds

**Theme Animation System**
- Card Animation: None, Pop Off, Rattle, Rattle Diagonal, Pulse, Slide Up
- Card Glow slider (0-100%) for edge glow effect on hover
- Text Animation: None, Typewriter, Fade In, Slide In
- Text Glow slider (0-100%) for text glow effect
- useAnimations hook for consistent theme-driven animations

**Home Page Animations**
- Hero section: card hover animations and typewriter text effect
- Featured Work: project cards with hover animations and glow effects
- Profile Card: animated card with glow on hover
- Case Study: card animations with glow effects
- Recent Articles: card hover animations and text glow on titles
- Toolbox: tech stack grid with card animations

**Admin Dashboard Animations**
- Stat cards with hover animations and glow effects
- Quick action cards with animations

**Home Page**
- Complete implementation matching design spec
- Sticky navbar with logo, navigation links, theme toggle, Login button, CV download button
- Profile card with avatar, "Ready_For_Hire" status, skills tags, location, contact CTA
- About section with bio, achievements, team avatars
- Case study section showcasing Enterprise Data Lake Engine project
- Interactive terminal section displaying stats and recent thoughts
- Toolbox grid with tech stack icons
- Recent articles section with blog post previews
- Footer with social links and version info

**Profile Settings**
- showContact toggle option for contact section visibility

**Authentication**
- Login page at `/admin/login` with email form
- NextAuth.js with email provider
- Magic link email delivery via Resend API
- MongoDB adapter for user/token storage
- JWT session strategy with 15-minute expiry
- Dev login for development environment

**UI Components**
- Button component with multiple variants (shadcn/ui style)
- Tooltip component using Radix UI primitives
- cn utility for Tailwind class merging
- Skeleton loading components
- Skills showcase component

#### Bug Fixes
- **Section Bar Shadow**: Fixed shadow intensity not applying to section bar elements
  - Elements inside section bars (profile and theme pages) now ignore shadow settings
  - Save buttons in section bars now follow shadow intensity settings
  - Added inline boxShadow style to ensure save buttons respect theme shadow

- **Border Style Options**: Updated border style to use thickness-based options
  - Replaced dashed/dotted options with thickness levels (None, Very Light, Light, Medium)
  - Border width now applied to buttons, inputs, and bordered elements
  - Updated theme context and CSS to handle border width dynamically

- **Theme Persistence**: Fixed various issues with theme settings not persisting
  - Fixed returnDocument usage (deprecated new option)
  - Fixed background image/video loading from MongoDB
  - Fixed section toggle persistence issues
  - Fixed empty state navbar visibility

- **GridFS**: Fixed bucket initialization error for file storage

- **Section Toggles**: Fixed persistence issue where Hero and Featured Projects would always revert to on

---

### v0.1.0 (2024-01-01)

#### Initial Setup
- Initial project setup with Next.js 16
- Created specification document (`docs/specs.md`)
- Created changelog for tracking

#### Core Infrastructure
- MongoDB integration with Mongoose ODM
- NextAuth.js with MongoDB adapter
- Magic link email authentication via Resend
- Route protection middleware

#### Public Pages
- Home page with hero, profile card, about, terminal, toolbox, articles, footer
- Blog page with article listing
- About page

#### Admin Dashboard
- Admin layout with sidebar navigation
- Dashboard with analytics overview
- Profile management with section toggle controls
- Theme customization (colors, fonts, animations)
- Content management (articles, projects)
- Messages management
- Settings page

#### Theme System
- Dark/light mode toggle with system preference detection
- ThemeProvider context with localStorage persistence
- Server-side dark mode default with client-side toggle
- Smooth transitions between themes
- 10 theme presets

#### Dependencies Added
- UI: @radix-ui/react-* (dialog, dropdown, tooltip, etc.), shadcn/ui
- Animation: framer-motion
- State: zustand
- Forms: react-hook-form, @hookform/resolvers, zod
- Data: @tanstack/react-query
- Charts: recharts
- Markdown: @mdx-js/*, remark-gfm, rehype-highlight
- Auth: next-auth, @auth/mongodb-adapter
- Email: resend
- Database: mongoose, mongodb
- Utilities: clsx, tailwind-merge, class-variance-authority, date-fns
