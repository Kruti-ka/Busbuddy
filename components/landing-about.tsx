import Image from "next/image"

export function LandingAbout() {
  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About BusBuddy</h2>
          <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
            Revolutionizing public transportation with digital solutions
          </p>
        </div>
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div className="flex items-center justify-center">
            <div className="relative h-[300px] w-full max-w-[500px] overflow-hidden rounded-lg">
              <Image src="/placeholder.svg?height=300&width=500" alt="About BusBuddy" fill className="object-cover" />
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Our Mission</h3>
              <p className="text-muted-foreground">
                At BusBuddy, we're committed to making public transportation more accessible, efficient, and
                user-friendly. Our digital bus pass and ticketing system aims to eliminate the hassle of physical
                tickets and long queues.
              </p>
              <h3 className="text-2xl font-bold">Our Vision</h3>
              <p className="text-muted-foreground">
                We envision a future where commuting by bus is the preferred choice for urban mobility, supported by
                smart technology that enhances the passenger experience and reduces environmental impact.
              </p>
              <h3 className="text-2xl font-bold">Our Values</h3>
              <ul className="ml-6 list-disc text-muted-foreground">
                <li>Innovation in transportation technology</li>
                <li>Commitment to user experience</li>
                <li>Environmental sustainability</li>
                <li>Accessibility for all commuters</li>
                <li>Reliability and security</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
