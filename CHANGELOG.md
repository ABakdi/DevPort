# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **Admin Panel**: Complete admin dashboard with sidebar navigation
- **Admin Layout**: Shared layout with sidebar for all admin pages
- **Profile Management**: Full profile editing with section toggle controls
- **Profile API**: GET/PUT endpoints for profile data management
- **Home Page Section Controls**: Toggle visibility of Hero, Profile Card, About, Terminal, Toolbox, Featured Projects, Recent Articles, Footer
- **Login Page**: Public login page with email input for magic link authentication
- **Dev Login**: Development environment authentication bypass
- **Middleware**: Route protection for admin pages
- **Admin Dashboard**: Analytics overview with stats cards and charts
- **Messages Page**: Contact form submissions management
- **Content Management**: Articles and projects management interface
- **Settings Page**: General configuration options
- **Theme Customization**: Color, font, and animation settings

### Changed
- **Home Page**: Updated to use profile-driven section visibility
- **Navbar**: Added Login/Admin links
- **Profile Card**: Enhanced UI with animations
- **About Section**: Improved layout
- **Case Study**: Updated for featured projects display
- **Footer**: Better styling
- **Toolbox**: Enhanced tech stack display
- **Login Form**: Better validation and loading states

### Fixed
- **Section Toggles**: Fixed persistence issue where Hero and Featured Projects would always revert to on
- **Empty State**: Navbar now stays visible when all sections are disabled

---

## [v0.1.0] - 2024-01-15

### Added
- **Authentication**: Magic link email authentication via Resend
- **MongoDB Integration**: Full database integration with Mongoose ODM
- **NextAuth.js**: Session management with MongoDB adapter
- **Home Page**: Complete landing page with hero, profile card, about, terminal, toolbox, articles, footer
- **Theme Support**: Dark/light mode toggle with system preference detection
- **UI Components**: Base shadcn/ui components

### Changed
- Project structure reorganization for Next.js App Router
