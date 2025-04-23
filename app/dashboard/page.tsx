"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"
import { LoadingScreen } from "@/components/loading-screen"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, MapPin, QrCode, TrendingUp, Bus, Calendar } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function Dashboard() {
  const { user, userProfile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalPasses: 0,
    activePasses: 0,
    tripsTaken: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return

      try {
        // Fetch passes
        const passesQuery = query(collection(db, "passes"), where("userId", "==", user.uid))
        const passesSnapshot = await getDocs(passesQuery)
        const passes = passesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as { endDate?: string }), // Explicitly typing the data
        }))

        // Fetch tickets
        const ticketsQuery = query(collection(db, "tickets"), where("userId", "==", user.uid))
        const ticketsSnapshot = await getDocs(ticketsQuery)

        // Calculate stats
        const now = new Date()
        const activePasses = passes.filter((pass) => pass.endDate && new Date(pass.endDate) >= now)

        setStats({
          totalPasses: passes.length,
          activePasses: activePasses.length,
          tripsTaken: ticketsSnapshot.size,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [user])

  if (loading) {
    return <LoadingScreen />
  }

  const userName = userProfile?.fullName?.split(" ")[0] || user?.email?.split("@")[0] || "User"

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-3xl font-bold tracking-tight text-neutral-dark md:text-4xl">
          Welcome, <span className="text-primary-red">{userName}</span>
        </h1>
        <p className="text-neutral-text">Manage your digital bus passes and tickets from your personalized dashboard</p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={item}>
          <Card className="dashboard-card h-full">
            <CardHeader className="dashboard-card-header bg-primary-red text-base-white">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="dashboard-card-content space-y-4 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-neutral-text">Total Passes</p>
                  <p className="dashboard-stat">{stats.totalPasses}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-neutral-text">Active Passes</p>
                  <p className="dashboard-stat">{stats.activePasses}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-neutral-text">Trips Taken</p>
                  <p className="dashboard-stat">{stats.tripsTaken}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-neutral-text">Saved (₹)</p>
                  <p className="dashboard-stat">{stats.tripsTaken * 15}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="dashboard-card h-full">
            <CardHeader className="dashboard-card-header">
              <CardTitle className="flex items-center gap-2 text-primary-red">
                <QrCode className="h-5 w-5" />
                Create Pass
              </CardTitle>
              <CardDescription>Get your digital bus pass</CardDescription>
            </CardHeader>
            <CardContent className="dashboard-card-content pt-4">
              <p className="mb-4 text-sm text-neutral-text">
                Create a new digital bus pass with QR code validation for quick boarding
              </p>
            </CardContent>
            <CardFooter className="px-5 pb-5">
              <Button asChild className="dashboard-btn-primary w-full">
                <Link href="/dashboard/create-pass">Create New Pass</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="dashboard-card h-full">
            <CardHeader className="dashboard-card-header">
              <CardTitle className="flex items-center gap-2 text-accent-blue">
                <QrCode className="h-5 w-5" />
                Active Passes
              </CardTitle>
              <CardDescription>View your active passes</CardDescription>
            </CardHeader>
            <CardContent className="dashboard-card-content pt-4">
              <p className="mb-4 text-sm text-neutral-text">
                {stats.activePasses > 0
                  ? `You have ${stats.activePasses} active pass${stats.activePasses > 1 ? "es" : ""}`
                  : "You don't have any active passes"}
              </p>
            </CardContent>
            <CardFooter className="px-5 pb-5">
              <Button asChild className="dashboard-btn-outline-secondary w-full">
                <Link href="/dashboard/view-pass">View Passes</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="dashboard-card h-full">
            <CardHeader className="dashboard-card-header">
              <CardTitle className="flex items-center gap-2 text-accent-blue">
                <MapPin className="h-5 w-5" />
                Track Bus
              </CardTitle>
              <CardDescription>Real-time bus tracking</CardDescription>
            </CardHeader>
            <CardContent className="dashboard-card-content pt-4">
              <p className="mb-4 text-sm text-neutral-text">
                Track your bus in real-time and get accurate arrival time estimates
              </p>
            </CardContent>
            <CardFooter className="px-5 pb-5">
              <Button asChild className="dashboard-btn-outline-secondary w-full">
                <Link href="/dashboard/track-bus">Track Now</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-6 md:grid-cols-2">
        <motion.div variants={item}>
          <Card className="dashboard-card h-full">
            <CardHeader className="dashboard-card-header bg-neutral-gray">
              <CardTitle className="flex items-center gap-2 text-primary-red">
                <CreditCard className="h-5 w-5" />
                Quick Book
              </CardTitle>
              <CardDescription>Book a ticket for your journey</CardDescription>
            </CardHeader>
            <CardContent className="dashboard-card-content space-y-4 pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Popular Routes</span>
                  <span className="text-xs text-neutral-text">Fare</span>
                </div>
                <div className="space-y-2">
                  {[
                    { route: "City Express (101)", fare: "₹50" },
                    { route: "Metro Connect (202)", fare: "₹45" },
                    { route: "Airport Shuttle (303)", fare: "₹75" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-neutral-gray"
                    >
                      <span className="font-medium">{item.route}</span>
                      <span>{item.fare}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="px-5 pb-5">
              <Button asChild className="dashboard-btn-primary w-full">
                <Link href="/dashboard/book-ticket">Book Ticket</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="dashboard-card h-full">
            <CardHeader className="dashboard-card-header">
              <CardTitle className="flex items-center gap-2 text-accent-blue">
                <Calendar className="h-5 w-5" />
                Upcoming Schedule
              </CardTitle>
              <CardDescription>Your upcoming bus schedule</CardDescription>
            </CardHeader>
            <CardContent className="dashboard-card-content space-y-4 pt-6">
              {stats.tripsTaken > 0 ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex items-center gap-3 rounded-lg border p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-blue/20">
                        <Bus className="h-5 w-5 text-accent-blue" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{["City Center", "Tech Park", "Airport Terminal"][index]} Route</p>
                          <p className="text-xs font-medium text-accent-blue">
                            {["10:30 AM", "2:15 PM", "6:45 PM"][index]}
                          </p>
                        </div>
                        <p className="text-xs text-neutral-text">{["Tomorrow", "In 3 days", "Next week"][index]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <Calendar className="mb-2 h-10 w-10 text-neutral-text" />
                  <h3 className="text-lg font-medium">No upcoming trips</h3>
                  <p className="text-sm text-neutral-text">Book a ticket to see your schedule</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="px-5 pb-5">
              <Button asChild className="dashboard-btn-outline-secondary w-full">
                <Link href="/dashboard/notifications">View All</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
