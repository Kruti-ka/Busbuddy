"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { LoginModal } from "@/components/login-modal"
import { SignupModal } from "@/components/signup-modal"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function LandingNavbar() {
  const { user } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">Bus</span>
              <span className="text-xl font-bold text-secondary"> Buddy</span>
          </Link>
        </div>

        <nav className="hidden md:flex md:items-center md:gap-6">
          <Link
            href="/#features"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="/#about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            About Us
          </Link>
          <Link
            href="/#contact"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Contact
          </Link>
        </nav>

        <div className="hidden md:flex md:items-center md:gap-4">
          {user ? (
            <Button asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setShowLoginModal(true)}>
                Sign In
              </Button>
              <Button onClick={() => setShowSignupModal(true)}>Sign Up</Button>
            </>
          )}
        </div>

        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col gap-4 pt-4">
              <Link href="/#features" className="text-sm font-medium">
                Features
              </Link>
              <Link href="/#about" className="text-sm font-medium">
                About Us
              </Link>
              <Link href="/#contact" className="text-sm font-medium">
                Contact
              </Link>
              {user ? (
                <Button asChild className="mt-4">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setShowLoginModal(true)} className="mt-4">
                    Sign In
                  </Button>
                  <Button onClick={() => setShowSignupModal(true)}>Sign Up</Button>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
      <SignupModal open={showSignupModal} onOpenChange={setShowSignupModal} />
    </header>
  )
}
