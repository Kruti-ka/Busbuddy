"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { DashboardHeader } from "@/components/dashboard-header"
import { NotificationList } from "@/components/notification-list"
import { LoadingScreen } from "@/components/loading-screen"

export default function Notifications() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return

      try {
        // Fetch notifications from Firestore
        const notificationsQuery = query(
          collection(db, "notifications"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc"),
        )
        const notificationsSnapshot = await getDocs(notificationsQuery)
        const notificationsData = notificationsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        // Check for pass expiry and generate notifications
        const passesQuery = query(collection(db, "passes"), where("userId", "==", user.uid))
        const passesSnapshot = await getDocs(passesQuery)

        const now = new Date()
        const expiryNotifications = passesSnapshot.docs
          .map((doc) => {
            const pass = doc.data()
            const endDate = new Date(pass.endDate)
            const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

            if (daysRemaining <= 7 && daysRemaining > 0) {
              return {
                id: `pass-expiry-${doc.id}`,
                type: "pass-expiry",
                title: "Pass Expiring Soon",
                message: `Your bus pass will expire in ${daysRemaining} day${daysRemaining > 1 ? "s" : ""}.`,
                createdAt: now.toISOString(),
                read: false,
              }
            } else if (daysRemaining <= 0) {
              return {
                id: `pass-expired-${doc.id}`,
                type: "pass-expired",
                title: "Pass Expired",
                message: "Your bus pass has expired. Please renew it to continue using our services.",
                createdAt: now.toISOString(),
                read: false,
              }
            }
            return null
          })
          .filter(Boolean)

        // Fetch tickets and generate notifications
        const ticketsQuery = query(
          collection(db, "tickets"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc"),
        )
        const ticketsSnapshot = await getDocs(ticketsQuery)

        const ticketNotifications = ticketsSnapshot.docs.map((doc) => {
          const ticket = doc.data()
          return {
            id: `ticket-${doc.id}`,
            type: "ticket-confirmation",
            title: "Ticket Confirmed",
            message: `Your ticket from ${ticket.source} to ${ticket.destination} on ${new Date(ticket.date).toLocaleDateString()} at ${ticket.time} has been confirmed.`,
            createdAt: ticket.createdAt.toDate().toISOString(),
            read: false,
          }
        })

        // Combine all notifications
        setNotifications(
          [...notificationsData, ...expiryNotifications, ...ticketNotifications].sort((a, b) => {
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
          }),
        )
      } catch (error) {
        console.error("Error fetching notifications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [user])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className="space-y-6">
      <DashboardHeader title="Notifications" description="Stay updated with important alerts and information" />
      <NotificationList notifications={notifications} />
    </div>
  )
}
