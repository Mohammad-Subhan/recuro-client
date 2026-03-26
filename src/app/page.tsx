"use client"

import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { CircleCheckBig } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

const LandingPage = () => {
  const router = useRouter()
  const user = useAppSelector((state) => state.auth.user)

  const features = [
    {
      icon: "/icons/video-camera.svg",
      title: "Screen Recording",
      description: "Record screen with system audio and microphone. Automatic stop at 20MB limit for optimal file sizes."
    },
    {
      icon: "/icons/upload.svg",
      title: "File Upload",
      description: "Upload existing videos (MP4, MOV, WebM) up to 20MB with automatic thumbnail generation."
    },
    {
      icon: "/icons/ai-light.svg",
      title: "AI Transcription",
      description: "Generate accurate video transcriptions using Groq Whisper AI with one click."
    },
    {
      icon: "/icons/library-active.svg",
      title: "Video Library",
      description: "Organize, search, and manage all your videos with detailed metadata and editing capabilities."
    },
    {
      icon: "/icons/share.svg",
      title: "Secure Sharing",
      description: "Share videos with unique, secure links. Download videos anytime, anywhere."
    },
  ]

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/icons/logo.svg" alt="Recura Logo" width={40} height={40} />
            <span className="text-2xl font-semibold">Recura</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Button
                onClick={() => router.push('/dashboard')}
                className="bg-button text-bg hover:bg-button/95 rounded-2xl cursor-pointer font-semibold px-6"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => router.push('/auth/login')}
                  variant="ghost"
                  className="text-text hover:text-text hover:bg-bg-secondary cursor-pointer rounded-2xl"
                >
                  Login
                </Button>
                <Button
                  onClick={() => router.push('/auth/register')}
                  className="bg-button text-bg hover:bg-button/95 rounded-2xl cursor-pointer"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="flex flex-col items-center text-center gap-8">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight max-w-4xl">
            Record, Share, and
            <span className="block bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              Collaborate Seamlessly
            </span>
          </h1>

          <p className="text-xl text-text-secondary max-w-2xl leading-relaxed">
            Record your screen with dual audio capture, upload videos, generate AI transcriptions,
            and share securely. All in one powerful platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
            <Button
              onClick={() => router.push(user ? '/dashboard' : '/auth/register')}
              className="bg-button text-bg hover:bg-button/95 rounded-2xl h-12 px-8 text-base font-semibold cursor-pointer"
            >
              <Image src="/icons/record.svg" alt="record" width={20} height={20} />
              {user ? 'Go to Dashboard' : 'Start Recording Free'}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything you need to
            <span className="block">record and share</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Record, upload, transcribe, and share videos with powerful features designed for efficiency.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-bg-secondary border border-border hover:border-text-secondary transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-button/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={24}
                  height={24}
                />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8 p-12 rounded-2xl bg-bg-secondary border border-border">
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">20MB</div>
            <div className="text-text-secondary">Max Video Size</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">1GB</div>
            <div className="text-text-secondary">Free Storage</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">AI</div>
            <div className="text-text-secondary">Powered Transcription</div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Choose the plan that works best for you
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="relative p-8 rounded-2xl bg-bg-secondary border-1 border-border hover:border-text-secondary/50 transition-all">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold">$0</span>
                <span className="text-text-secondary">/month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <CircleCheckBig height={20} width={20} color="#00C950" />
                <span className="text-text">Unlimited recordings</span>
              </li>
              <li className="flex items-start gap-3">
                <CircleCheckBig height={20} width={20} color="#00C950" />
                <span className="text-text">1GB storage</span>
              </li>
              <li className="flex items-start gap-3">
                <CircleCheckBig height={20} width={20} color="#00C950" />
                <span className="text-text">20MB max video size</span>
              </li>
              <li className="flex items-start gap-3">
                <CircleCheckBig height={20} width={20} color="#00C950" />
                <span className="text-text">AI transcription</span>
              </li>
              <li className="flex items-start gap-3">
                <CircleCheckBig height={20} width={20} color="#00C950" />
                <span className="text-text">Secure video sharing</span>
              </li>
              <li className="flex items-start gap-3">
                <CircleCheckBig height={20} width={20} color="#00C950" />
                <span className="text-text">Basic support</span>
              </li>
            </ul>

            <Button
              onClick={() => router.push('/register')}
              variant="outline"
              className="w-full h-12 rounded-2xl border-1 border-border hover:bg-border text-text font-semibold cursor-pointer"
            >
              Get Started
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="relative p-8 rounded-2xl bg-bg-secondary border-1 border-text hover:shadow-lg hover:shadow-text-placeholder/20 transition-all">
            {/* Popular Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-button text-bg text-sm font-semibold rounded-full">
              Most Popular
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold">$12</span>
                <span className="text-text-secondary">/month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <CircleCheckBig height={20} width={20} color="#00C950" />
                <span className="text-text">Unlimited recordings</span>
              </li>
              <li className="flex items-start gap-3">
                <CircleCheckBig height={20} width={20} color="#00C950" />
                <span className="text-text">50GB storage</span>
              </li>
              <li className="flex items-start gap-3">
                <CircleCheckBig height={20} width={20} color="#00C950" />
                <span className="text-text">100MB max video size</span>
              </li>
              <li className="flex items-start gap-3">
                <CircleCheckBig height={20} width={20} color="#00C950" />
                <span className="text-text">Unlimited AI transcription</span>
              </li>
              <li className="flex items-start gap-3">
                <CircleCheckBig height={20} width={20} color="#00C950" />
                <span className="text-text">Advanced video analytics</span>
              </li>
              <li className="flex items-start gap-3">
                <CircleCheckBig height={20} width={20} color="#00C950" />
                <span className="text-text">Priority support</span>
              </li>
              <li className="flex items-start gap-3">
                <CircleCheckBig height={20} width={20} color="#00C950" />
                <span className="text-text">Custom branding</span>
              </li>
            </ul>

            <Button
              onClick={() => router.push('/register')}
              className="w-full h-12 rounded-2xl bg-button hover:bg-button/90 text-bg cursor-pointer font-semibold"
            >
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="text-center p-16 rounded-3xl bg-gradient-to-br from-bg-secondary to-bg border border-border">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to start recording?
          </h2>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Start recording your screen with dual audio, generate AI transcriptions, and share your videos instantly.
          </p>
          <Button
            onClick={() => router.push(user ? '/dashboard' : '/register')}
            className="bg-button text-bg hover:bg-button/95 rounded-2xl h-12 px-8 text-base font-semibold cursor-pointer"
          >
            {user ? 'Go to Dashboard' : 'Get Started for Free'}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image src="/icons/logo.svg" alt="Recura Logo" width={32} height={32} />
                <span className="text-xl font-semibold">Recura</span>
              </div>
              <p className="text-sm text-text-secondary">
                Modern screen recording made simple and powerful.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="hover:text-text cursor-pointer">Features</li>
                <li className="hover:text-text cursor-pointer">Pricing</li>
                <li className="hover:text-text cursor-pointer">Download</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="hover:text-text cursor-pointer">About</li>
                <li className="hover:text-text cursor-pointer">Blog</li>
                <li className="hover:text-text cursor-pointer">Careers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="hover:text-text cursor-pointer">Help Center</li>
                <li className="hover:text-text cursor-pointer">Contact</li>
                <li className="hover:text-text cursor-pointer">Privacy</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-center text-sm text-text-secondary">
            © 2025 Recura. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage