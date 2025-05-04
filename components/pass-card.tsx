"use client"

import { useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, MapPin, Route, Download, Share2, Phone } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface PassCardProps {
  pass: {
    id: string
    userId: string
    fullName: string
    startDate: string
    endDate: string
    source: string
    destination: string
    route: string
    emergencyContactName: string
    emergencyContactMobile: string
    profileImageUrl?: string
  }
}

export function PassCard({ pass }: PassCardProps) {
  const [daysRemaining, setDaysRemaining] = useState(0)
  const [qrValue, setQrValue] = useState("")
  const [isExpired, setIsExpired] = useState(false)
  const [dailyTripCount, setDailyTripCount] = useState(0)
  const { userProfile } = useAuth()

  useEffect(() => {
    // Calculate days remaining
    const endDate = new Date(pass.endDate)
    const now = new Date()
    const diffTime = endDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    setDaysRemaining(diffDays)
    
    // Check if pass is expired based on end date
    setIsExpired(diffDays <= 0)

    // Generate QR code value with the specified format
    const qrData = {
      passId: pass.id,
      fullName: pass.fullName,
      startDate: pass.startDate,
      endDate: pass.endDate
    }
    setQrValue(JSON.stringify(qrData))
    
    // Fetch daily trip count from Firestore
    const fetchDailyTripCount = async () => {
      try {
        const scannedQrRef = doc(db, "scanned_qrs", pass.id)
        const scannedQrSnap = await getDoc(scannedQrRef)
        
        if (scannedQrSnap.exists()) {
          const data = scannedQrSnap.data()
          setDailyTripCount(data.daily_trip_count || 0)
        } else {
          // No record found, set to 0
          setDailyTripCount(0)
        }
      } catch (error) {
        console.error("Error fetching daily trip count:", error)
        setDailyTripCount(0)
      }
    }
    
    fetchDailyTripCount()
  }, [pass])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleDownload = () => {
    const svg = document.getElementById("qr-code-svg")
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      if (ctx) {
        ctx.fillStyle = "white"
      }
      ctx?.fillRect(0, 0, canvas.width, canvas.height)
      ctx?.drawImage(img, 0, 0)
      
      const pngFile = canvas.toDataURL("image/png")
      const downloadLink = document.createElement("a")
      downloadLink.download = `bus-pass-${pass.id.substring(0, 8)}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "My Bus Pass",
          text: `Check out my bus pass for ${pass.route} route`,
          url: window.location.href,
        })
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(window.location.href)
        alert("Link copied to clipboard!")
      }
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  // Determine which profile image URL to use
  const profileImageUrl = pass.profileImageUrl || userProfile?.profileImageUrl || "/placeholder.svg"
  
  // Determine QR code color based on dailyTripCount and expiration status
  const getQRColor = () => {
    if (isExpired || dailyTripCount >= 2) {
      return "#d1d5db" // Gray QR when expired or daily trip count is 2
    } else if (dailyTripCount === 1) {
      return "#22c55e" // Green QR when daily trip count is 1
    } else {
      return "#111827" // Black QR when daily trip count is 0
    }
  }
  
  // Determine if QR code should show invalid overlay
  const showInvalidOverlay = isExpired || dailyTripCount >= 2
  
  // Get appropriate message for invalid QR
  const getInvalidMessage = () => {
    if (isExpired) {
      return "Pass is expired"
    } else if (dailyTripCount >= 2) {
      return "Last Trip Done"
    }
    return ""
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="overflow-hidden border-0 shadow-xl">
          {/* Card Header with Solid Color */}
          <CardHeader className={cn(
            "relative p-6 text-white",
            "bg-primary",
            "border-b border-white/10"
          )}>
            <div className="absolute inset-0 bg-noise opacity-10" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <CardTitle className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <span className="bg-white/20 p-2 rounded-lg">
                      <Route className="h-5 w-5" />
                    </span>
                    Digital Bus Pass
                  </CardTitle>
                </motion.div>
              </div>
              
              <Badge
                variant={daysRemaining > 7 ? "outline" : "destructive"}
                className={cn(
                  "text-sm font-medium py-1.5 px-3 rounded-lg shadow-sm",
                  daysRemaining > 7 
                    ? "bg-white/10 text-white backdrop-blur-sm border-white/20"
                    : "bg-destructive text-white border-white/20"
                )}
              >
                {daysRemaining > 0 ? `${daysRemaining} days remaining` : "Expired"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 divide-x divide-gray-100 dark:divide-gray-800">
              {/* Left Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="p-6 space-y-6"
              >
                {/* User Profile */}
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                      <AvatarImage 
                        src={profileImageUrl} 
                        alt={pass.fullName}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary text-white font-medium">
                        {pass.fullName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{pass.fullName}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Pass ID: <span className="font-mono font-medium">{pass.id.substring(0, 8)}</span>
                    </p>
                  </div>
                </div>

                {/* Pass Details */}
                <div className="space-y-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 p-5 border border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>Start Date</span>
                      </div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatDate(pass.startDate)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>End Date</span>
                      </div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatDate(pass.endDate)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>Route</span>
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {pass.source} → {pass.destination}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <Route className="inline h-3 w-3 mr-1" />
                      {pass.route}
                    </p>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="space-y-3 rounded-xl bg-destructive/10 dark:bg-destructive/20 p-5 border border-destructive/20 dark:border-destructive/30">
                  <h4 className="flex items-center gap-2 font-medium text-destructive dark:text-destructive-foreground">
                    <Phone className="h-4 w-4" />
                    Emergency Contact
                  </h4>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {pass.emergencyContactName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {pass.emergencyContactMobile}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-destructive dark:text-destructive-foreground">
                      Call
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Right Section - QR Code */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="p-6 flex flex-col items-center justify-center space-y-6 bg-gray-50 dark:bg-gray-800/30"
              >
                <motion.div
                  initial={{ scale: 0.9, rotate: -5 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="relative"
                >
                  <div className="absolute -inset-2 rounded-xl bg-primary/20 blur" />
                  <div className="relative rounded-lg bg-white p-4 shadow-lg border border-gray-200 dark:border-gray-700">
                    {/* QR Code with dynamic color based on trip count */}
                    <div className="relative">
                      <QRCodeSVG
                        id="qr-code-svg"
                        value={qrValue}
                        size={220}
                        level="H"
                        includeMargin
                        bgColor="#FFFFFF"
                        fgColor={getQRColor()}
                      />
                      
                      {/* Invalid overlay for expired pass or used trips */}
                      {showInvalidOverlay && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                            <span className="text-5xl">❌</span>
                          </div>
                          <div className="absolute bottom-6 left-0 right-0 text-center">
                            <span className="bg-white/90 px-3 py-1 rounded-md text-red-600 font-bold text-sm">
                              Invalid
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Status message for invalid pass */}
                {showInvalidOverlay && (
                  <div className="bg-red-50 border border-red-200 rounded-md px-4 py-2 text-red-700 text-center w-full max-w-xs">
                    {getInvalidMessage()}
                  </div>
                )}
                
                {/* Display daily trip counter */}
                <div className="bg-blue-50 border border-blue-200 rounded-md px-4 py-2 text-blue-700 text-center w-full max-w-xs">
                  Trips today: {dailyTripCount}/2 
                </div>

                <div className="flex gap-3 w-full max-w-xs">
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    onClick={handleDownload}
                    disabled={isExpired || dailyTripCount >= 2}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    onClick={handleShare}
                    disabled={isExpired || dailyTripCount >= 2}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>

                <div className="w-full pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-center text-gray-400 dark:text-gray-500">
                    Valid only for the specified route and duration
                  </p>
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}