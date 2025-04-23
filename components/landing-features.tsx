import { CreditCard, MapPin, QrCode, Bell, Clock, Shield } from "lucide-react"

export function LandingFeatures() {
  return (
    <section id="features" className="bg-muted/50 py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
          <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
            Everything you need for a seamless bus travel experience
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <QrCode className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Digital Bus Pass</h3>
            <p className="text-muted-foreground">
              Create and manage digital bus passes with QR code validation for quick boarding.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Real-time Tracking</h3>
            <p className="text-muted-foreground">
              Track your bus in real-time and get accurate arrival time estimates.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Online Booking</h3>
            <p className="text-muted-foreground">
              Book tickets online with secure payment options and instant confirmation.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Smart Notifications</h3>
            <p className="text-muted-foreground">Get timely notifications about pass expiry, bus delays, and more.</p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Schedule Viewing</h3>
            <p className="text-muted-foreground">Access bus schedules and plan your journey in advance.</p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Secure System</h3>
            <p className="text-muted-foreground">
              Your data is protected with advanced security measures and encryption.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
