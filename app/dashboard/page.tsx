"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"
import { LoadingScreen } from "@/components/loading-screen"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, MapPin, QrCode, TrendingUp, Bus, Calendar, Clock, Zap, Wallet, Route } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

export default function Dashboard() {
  const { user, userProfile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalPasses: 0,
    activePasses: 0,
    tripsTaken: 0,
    savings: 0,
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
          ...(doc.data() as { endDate?: string }),
        }))

        // Fetch tickets
        const ticketsQuery = query(collection(db, "tickets"), where("userId", "==", user.uid))
        const ticketsSnapshot = await getDocs(ticketsQuery)

        // Calculate stats
        const now = new Date()
        const activePasses = passes.filter((pass) => pass.endDate && new Date(pass.endDate) >= now)
        const savings = ticketsSnapshot.size * 15 // ₹15 savings per trip

        setStats({
          totalPasses: passes.length,
          activePasses: activePasses.length,
          tripsTaken: ticketsSnapshot.size,
          savings,
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
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Welcome , <span  style={{ color: '#FF9D23' }}>{userName}</span>
        </h1>
        <p className="text-muted-foreground">Here's what's happening with your transit today</p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {/* All stat cards have same fixed height */}
        <motion.div variants={item}>
          <Card className="relative h-32 overflow-hidden border-0 bg-gradient-primary shadow-lg">
            <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-white/10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Total Passes</CardTitle>
              <Wallet className="h-5 w-5 text-white/80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalPasses}</div>
              <p className="text-xs text-white/80">+12% from last month</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="h-32 border-0 bg-gradient-secondary shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Active Passes</CardTitle>
              <Zap className="h-5 w-5 text-white/80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.activePasses}</div>
              <p className="text-xs text-white/80">Currently valid</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="h-32 border-0 bg-gradient-dark shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Trips Taken</CardTitle>
              <Route className="h-5 w-5 text-white/80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.tripsTaken}</div>
              <p className="text-xs text-white/80">+5 this week</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="h-32 border-0 bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Total Savings</CardTitle>
              <TrendingUp className="h-5 w-5 text-white/80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">₹{stats.savings}</div>
              <p className="text-xs text-white/80">vs. single tickets</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Main Actions */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {/* All action cards have same fixed height */}
        <motion.div variants={item}>
          <Card className="h-64 border-0 bg-white shadow-sm dark:bg-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <QrCode className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Create New Pass</CardTitle>
                  <CardDescription>Get your digital bus pass</CardDescription>
                </div>

                
              </div>
            </CardHeader>
            <CardContent className="flex flex-col justify-between h-32">
              <p className="text-sm text-muted-foreground">
                Create a new digital bus pass with QR code validation for quick boarding
              </p>
              <Button asChild className="w-full mt-4 bg-[#25C199] text-white hover:bg-[#1FA883]">


                <Link href="/dashboard/create-pass">Create Pass</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="h-64 border-0 bg-white shadow-sm dark:bg-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-secondary/10 p-2">
                  <QrCode className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Active Passes</CardTitle>
                  <CardDescription>Manage your current passes</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col justify-between h-32">
              <p className="text-sm text-muted-foreground">
                {stats.activePasses > 0
                  ? `You have ${stats.activePasses} active pass${stats.activePasses > 1 ? "es" : ""}`
                  : "No active passes currently"}
              </p>
              <Button asChild className="w-full mt-4 bg-[#25C199] text-white hover:bg-[#1FA883]">
                <Link href="/dashboard/view-pass">View Passes</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="h-64 border-0 bg-white shadow-sm dark:bg-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-secondary/10 p-2">
                  <MapPin className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Track Bus</CardTitle>
                  <CardDescription>Real-time bus tracking</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col justify-between h-32">
              <p className="text-sm text-muted-foreground">
                Track your bus in real-time and get accurate arrival time estimates
              </p>
              <Button asChild className="w-full mt-4 bg-[#25C199] text-white hover:bg-[#1FA883]">
                <Link href="/dashboard/track-bus">Track Now</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Bottom Section */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-6 lg:grid-cols-2">
        {/* Bottom cards with consistent heights */}
        <motion.div variants={item}>
          <Card className="h-96 border-0 bg-white shadow-sm dark:bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Quick Book
              </CardTitle>
              <CardDescription>Book a ticket for your journey</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Popular Routes</span>
                  <span className="text-xs text-muted-foreground">Fare</span>
                </div>
                <div className="space-y-3">
                  {[
                    { route: "City Express (101)", fare: "₹50", time: "Every 15 min", badge: "Express" },
                    { route: "Metro Connect (202)", fare: "₹45", time: "Every 20 min", badge: "Frequent" },
                    { route: "Airport Shuttle (303)", fare: "₹75", time: "Every 30 min", badge: "Premium" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Bus className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{item.route}</p>
                          <p className="text-xs text-muted-foreground">{item.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{item.badge}</Badge>
                        <span className="font-medium">{item.fare}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/dashboard/book-ticket">Book Ticket</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="h-96 border-0 bg-white shadow-sm dark:bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Upcoming Schedule
              </CardTitle>
              <CardDescription>Your upcoming bus schedule</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              {stats.tripsTaken > 0 ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex items-center gap-4 rounded-lg border p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                        <Bus className="h-6 w-6 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{["City Center", "Tech Park", "Airport Terminal"][index]} Route</p>
                          <p className="text-sm font-medium text-secondary">
                            {["10:30 AM", "2:15 PM", "6:45 PM"][index]}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">{["Tomorrow", "In 3 days", "Next week"][index]}</p>
                          <Badge variant="secondary">{["Confirmed", "Scheduled", "Pending"][index]}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Calendar className="mb-3 h-12 w-12 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No upcoming trips</h3>
                  <p className="text-sm text-muted-foreground">Book a ticket to see your schedule</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard/notifications">View All</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}