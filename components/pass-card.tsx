"use client"

import { useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, MapPin, Route, Download, Share2 } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"

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
  const { userProfile } = useAuth()

  useEffect(() => {
    // Calculate days remaining
    const endDate = new Date(pass.endDate)
    const now = new Date()
    const diffTime = endDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    setDaysRemaining(diffDays)

    // Generate QR code value with the specified format
    const qrData = {
      passId: pass.id,
      fullName: pass.fullName,
      startDate: pass.startDate,
      endDate: pass.endDate
    }
    setQrValue(JSON.stringify(qrData))
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

  // Determine which profile image URL to use - prioritize the one from the pass
  const profileImageUrl = pass.profileImageUrl || userProfile?.profileImageUrl || "/placeholder.svg"

  return (
    <Card className="dashboard-card overflow-hidden">
      <CardHeader className="dashboard-card-header bg-gradient-to-r from-primary to-primary/90 text-white">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <motion.div
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              Digital Bus Pass
            </motion.div>
          </CardTitle>
          <Badge
            variant={daysRemaining > 7 ? "outline" : "destructive"}
            className={
              daysRemaining > 7
                ? "bg-accent/20 text-white border-white/30"
                : "bg-destructive text-white border-white/30"
            }
          >
            {daysRemaining > 0 ? `${daysRemaining} days remaining` : "Expired"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary">
                <AvatarImage 
                  src={profileImageUrl} 
                  alt={pass.fullName} 
                />
                <AvatarFallback className="bg-primary text-white">
                  {pass.fullName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-bold text-primary">{pass.fullName}</h3>
                <p className="text-sm text-muted-foreground">Pass ID: {pass.id.substring(0, 8)}</p>
              </div>
            </div>

            <div className="space-y-3 rounded-lg bg-muted p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-sm">
                  Valid from: <span className="font-medium">{formatDate(pass.startDate)}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm">
                  Valid until: <span className="font-medium">{formatDate(pass.endDate)}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm">
                  <span className="font-medium">{pass.source}</span> to{" "}
                  <span className="font-medium">{pass.destination}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Route className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{pass.route}</span>
              </div>
            </div>

            <div className="space-y-2 rounded-lg bg-accent/10 p-4">
              <h4 className="font-medium text-accent">Emergency Contact</h4>
              <p className="text-sm">
                <span className="font-medium">{pass.emergencyContactName}:</span> {pass.emergencyContactMobile}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center justify-center space-y-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-lg bg-white p-3 shadow-md"
            >
              <QRCodeSVG
                id="qr-code-svg"
                value={qrValue}
                size={200}
                level="H"
                includeMargin
                bgColor="#FFFFFF"
                fgColor="#000000"
              />
            </motion.div>
            <p className="text-center text-sm text-muted-foreground">Scan this QR code to validate your pass</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button
                variant="outline"
                className="border-accent text-accent hover:bg-accent/10"
                onClick={handleShare}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  )
}