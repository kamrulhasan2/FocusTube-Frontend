"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Brain,
  CalendarCheck,
  Check,
  Flame,
  LayoutGrid,
  Lock,
  Menu,
  PlayCircle,
  ArrowUp,
  Sparkles,
  TimerReset,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { PricingTable } from "@/features/billing/components/PricingTable"
import { cn } from "@/lib/utils"

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  viewport: { once: true, amount: 0.3 },
}

const staggerContainer = {
  initial: { opacity: 1 },
  whileInView: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
  viewport: { once: true, amount: 0.3 },
}

const featureItems = [
  {
    title: "Ad-Free Learning",
    description: "No ads, no distractions, no recommendations. Just focus.",
    icon: Lock,
  },
  {
    title: "Smart Notes",
    description: "Markdown notes synced with video timestamps for fast review.",
    icon: LayoutGrid,
  },
  {
    title: "AI Summaries",
    description: "Instant, structured summaries powered by Gemini AI.",
    icon: Sparkles,
  },
  {
    title: "Progress Tracking",
    description: "Track each playlist like a real course and stay accountable.",
    icon: CalendarCheck,
  },
  {
    title: "Resume Learning",
    description: "Pick up exactly where you left off across every device.",
    icon: TimerReset,
  },
  {
    title: "Structured Playlists",
    description: "Turn any YouTube playlist into a guided learning path.",
    icon: Brain,
  },
]

const steps = [
  {
    title: "Import Playlist",
    description: "Paste a YouTube playlist link and FocusTube structures it instantly.",
    icon: Flame,
  },
  {
    title: "Learn Without Distractions",
    description: "Enjoy a clean learning room with zero noise and full focus.",
    icon: Lock,
  },
  {
    title: "Master with AI + Notes",
    description: "Summaries, notes, and progress keep you moving forward.",
    icon: Check,
  },
]

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
]

export default function Home() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-white scroll-smooth">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-130 w-130 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[140px]" />
        <div className="absolute top-1/3 right-10 h-105 w-105 rounded-full bg-purple-500/15 blur-[160px]" />
      </div>

      <Navbar />

      <main className="relative">
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <CTA />
      </main>

      <Footer />

      <motion.div
        className={cn(
          "fixed bottom-6 right-6 z-50 transition-all",
          showScrollTop ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        initial={false}
        animate={{ opacity: showScrollTop ? 1 : 0, y: showScrollTop ? 0 : 8 }}
        transition={{ duration: 0.25 }}
      >
        <Button
          type="button"
          size="icon"
          variant="secondary"
          aria-label="Scroll to top"
          className="h-11 w-11 rounded-full border border-white/10 bg-slate-950/80 text-white shadow-2xl backdrop-blur"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" })
          }}
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  )
}

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-300">
            FT
          </span>
          FocusTube
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="border-white/10 bg-slate-950 text-white">
              <SheetHeader>
                <SheetTitle className="text-white">FocusTube</SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-4">
                {navLinks.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-sm text-slate-300 transition-colors hover:text-white"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
              <div className="mt-10 flex flex-col gap-3">
                <Button variant="ghost" asChild>
                  <Link href="/login">Log In</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

const Hero = () => {
  return (
    <section className="relative overflow-hidden pb-24 pt-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div {...fadeUp} className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
            <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
            AI-powered learning OS for YouTube
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Learn from YouTube.{" "}
              <span className="bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Without the Noise.
              </span>
            </h1>
            <p className="text-lg text-slate-300">
              Transform any playlist into a structured course with AI summaries,
              timestamped notes, and real progress tracking.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" asChild>
              <Link href="/register">Start for Free</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/20" asChild>
              <Link href="#how-it-works">
                <span className="flex items-center gap-2">
                  <PlayCircle className="h-4 w-4" />
                  Watch Demo
                </span>
              </Link>
            </Button>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            {["No credit card required", "Built for deep focus", "Start in 60 seconds"].map(
              (item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  {item}
                </div>
              ),
            )}
          </div>
        </motion.div>

        <motion.div {...fadeUp} className="relative">
          <div className="absolute -inset-6 rounded-4xl bg-linear-to-br from-indigo-500/20 via-purple-500/10 to-transparent blur-2xl" />
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.25),transparent_60%)]" />
            <div className="relative flex h-full flex-col gap-4 p-6">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>FocusTube Learning Room</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
                  AI Summary
                </span>
              </div>
              <div className="grid flex-1 gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-xl border border-white/10 bg-slate-950/70 p-4">
                  <div className="h-3 w-24 rounded-full bg-white/10" />
                  <div className="mt-4 space-y-2">
                    {["", "", ""].map((_, index) => (
                      <div
                        key={index}
                        className={cn(
                          "h-2 rounded-full bg-white/10",
                          index === 1 && "w-3/4",
                          index === 2 && "w-2/3",
                        )}
                      />
                    ))}
                  </div>
                  <div className="mt-6 h-24 rounded-lg border border-white/10 bg-white/5" />
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-950/70 p-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Notes</span>
                    <span className="text-indigo-300">12:48</span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {["Key insight", "Next action", "Review later"].map((item) => (
                      <div
                        key={item}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Progress</span>
                <span>68% complete</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/10">
                <div className="h-2 w-2/3 rounded-full bg-indigo-500" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

const Features = () => {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div {...fadeUp} className="max-w-2xl space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Features</p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            Everything you need to turn videos into learning momentum
          </h2>
          <p className="text-slate-300">
            FocusTube removes the noise and adds the tools that help you actually finish
            what you start.
          </p>
        </motion.div>

        <motion.div
          {...staggerContainer}
          className="mt-12 grid gap-6 lg:grid-cols-3"
        >
          {featureItems.map((item) => (
            <motion.div key={item.title} variants={fadeUp}>
              <Card className="h-full border-white/10 bg-white/5 p-6 text-white transition-all hover:scale-[1.02] hover:border-indigo-500/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{item.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div {...fadeUp} className="max-w-2xl space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">How it works</p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            Three steps to distraction-free mastery
          </h2>
          <p className="text-slate-300">
            FocusTube gives you a repeatable workflow: import, learn, and retain.
          </p>
        </motion.div>

        <motion.div
          {...staggerContainer}
          className="mt-12 grid gap-6 lg:grid-cols-3"
        >
          {steps.map((step, index) => (
            <motion.div key={step.title} variants={fadeUp}>
              <Card className="h-full border-white/10 bg-slate-950/70 p-6 text-white shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-indigo-300">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Step {index + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{step.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

const Pricing = () => {
  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div {...fadeUp} className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Pricing</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-300">
            Start free and upgrade when you are ready to unlock AI summaries and advanced
            learning analytics.
          </p>
        </motion.div>
        <div className="mt-12">
          <PricingTable />
        </div>
      </div>
    </section>
  )
}

const CTA = () => {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          {...fadeUp}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-indigo-600/30 via-purple-600/20 to-slate-950 p-10 text-center shadow-2xl"
        >
          <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-indigo-500/30 blur-[120px]" />
          <div className="relative space-y-4">
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              Ready to supercharge your learning?
            </h2>
            <p className="mx-auto max-w-2xl text-slate-200">
              Join FocusTube and turn YouTube into your personal university with AI,
              focus-first tools, and a progress system that keeps you moving.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button size="lg" asChild>
                <Link href="/register">Create Free Account</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/20" asChild>
                <Link href="/login">Log In</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

const Footer = () => {
  return (
    <footer className="border-t border-white/10 pb-20 pt-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-500 md:flex-row">
        <div>© 2026 FocusTube</div>
        <div>Built by Md. Kamrul Hasan</div>
        <div className="flex items-center gap-4">
          <a href="#" className="transition-colors hover:text-white">
            Privacy
          </a>
          <a href="#" className="transition-colors hover:text-white">
            Terms
          </a>
          <a
            href="https://github.com/kamrulhasan2"
            className="transition-colors hover:text-white"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
