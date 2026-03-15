"use client"

import { motion } from "framer-motion"

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <motion.div
      className={`animate-pulse rounded-lg ${className}`}
      style={{
        backgroundColor: 'var(--theme-surface)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
  )
}

export function HeroSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      <div className="lg:col-span-7 lg:pt-8 space-y-6">
        <Skeleton className="w-32 h-8 rounded-full" />
        <Skeleton className="w-3/4 h-12" />
        <Skeleton className="w-1/2 h-8" />
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-2/3 h-6" />
        <div className="flex gap-2">
          <Skeleton className="w-20 h-10" />
          <Skeleton className="w-20 h-10" />
          <Skeleton className="w-20 h-10" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="w-40 h-12" />
          <Skeleton className="w-12 h-12" />
          <Skeleton className="w-12 h-12" />
        </div>
      </div>
      <div className="lg:col-span-5 space-y-6">
        <Skeleton className="w-full h-48 rounded-2xl" />
        <Skeleton className="w-full h-32 rounded-2xl" />
      </div>
    </div>
  )
}

export function SkillsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Skeleton className="w-32 h-6" />
        <Skeleton className="w-48 h-10" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export function FeaturedWorkSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Skeleton className="w-32 h-6" />
        <Skeleton className="w-56 h-10" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-80 rounded-2xl" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function TerminalSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="w-32 h-8" />
      <Skeleton className="h-80 rounded-2xl" />
    </div>
  )
}

export function HomeSkeleton() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* Profile Card (4 cols) + About Section (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <Skeleton className="w-full h-[450px] rounded-xl" />
        </div>
        <div className="lg:col-span-8">
          <Skeleton className="w-full h-[450px] rounded-xl" />
        </div>
      </div>

      {/* Featured Project */}
      <Skeleton className="w-full h-[400px] rounded-xl" />

      {/* Terminal (7 cols) + Right Column (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <Skeleton className="w-full h-[350px] rounded-xl" />
        </div>
        <div className="lg:col-span-5 space-y-6">
          <Skeleton className="w-full h-[165px] rounded-xl" />
          <Skeleton className="w-full h-[165px] rounded-xl" />
        </div>
      </div>
    </main>
  )
}
