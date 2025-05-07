"use client"

import { motion } from "framer-motion"
import {
  Phone,
  Mail,
  Calendar,
  MapPin,
  Pencil,
  ShieldCheck
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ProfileCardProps {
  userProfile: {
    fullName?: string
    email?: string
    mobile?: string
    gender?: string
    createdAt?: string
    location?: string
    role?: string
  }
  onEditClick: () => void
}

export function ProfileCard({ userProfile, onEditClick }: ProfileCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getGenderBadgeClass = (gender?: string) => {
    switch (gender) {
      case "male":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "female":
        return "bg-pink-100 text-pink-800 border-pink-200"
      case "other":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const capitalize = (text: string = "") => {
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border shadow-md">
        <CardHeader className="bg-gradient-to-r from-primary to-primary/60 text-center py-6">
          <h2 className="text-2xl font-bold text-white">
            {userProfile.fullName || "User"}
          </h2>
          <Badge
            className={cn(
              "px-3 py-1 text-xs mt-2",
              getGenderBadgeClass(userProfile.gender)
            )}
          >
            {capitalize(userProfile.gender || "Unknown")}
          </Badge>

          {userProfile.role && (
            <div className="flex items-center justify-center mt-2 text-sm text-white">
              <ShieldCheck className="h-4 w-4 mr-1" />
              {userProfile.role}
            </div>
          )}
        </CardHeader>

        <CardContent className="py-6 px-6">
          <div className="flex justify-center mb-8">
            <Button onClick={onEditClick} className="flex items-center gap-2">
              <Pencil className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50/50 dark:bg-gray-800/20">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {userProfile.email || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50/50 dark:bg-gray-800/20">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Mobile</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {userProfile.mobile || "N/A"}
                </p>
              </div>
            </div>

            {userProfile.location && (
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50/50 dark:bg-gray-800/20">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {userProfile.location}
                  </p>
                </div>
              </div>
            )}

            {userProfile.createdAt && (
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50/50 dark:bg-gray-800/20">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Member Since</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDate(userProfile.createdAt)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
