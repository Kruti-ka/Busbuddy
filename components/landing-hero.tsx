import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-24 lg:py-32">
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-secondary"> HOP ON, HASSLE-FREE
              </h2>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                <span className="text-primary">SMART ECO-</span>
                <span className="text-secondary">COMMUTE</span>
                <br />
              
                </h1>
                <h2>
                <span className="text-muted-foreground"> - Your Travel Companion</span>
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Bus Buddy provides real-time bus tracking and e-pass services, ensuring you never miss a ride. 
              Simplify your daily commute with route updates, accurate bus timings, and seamless ticketing.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" className="font-medium">
                <Link href="#features">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#about">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[350px] w-[350px] md:h-[400px] md:w-[400px] lg:h-[500px] lg:w-[500px]">
              <Image
                src="/placeholder.svg?height=500&width=500"
                alt="BusBuddy App"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
