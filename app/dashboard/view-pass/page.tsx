"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, doc, setDoc, serverTimestamp } from "firebase/firestore"
import { DashboardHeader } from "@/components/dashboard-header"
import { PassCard } from "@/components/pass-card"
import { Button } from "@/components/ui/button"
import { LoadingScreen } from "@/components/loading-screen"

interface BusPass {
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

export default function ViewPass() {
  const router = useRouter()
  const { user, userProfile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [pass, setPass] = useState<BusPass | null>(null)

  useEffect(() => {
    const fetchPass = async () => {
      if (!user) return

      try {
        const now = new Date()
        const passesQuery = query(collection(db, "passes"), where("userId", "==", user.uid))
        const passesSnapshot = await getDocs(passesQuery)

        // Find active pass
        const activePass = passesSnapshot.docs
          .map((doc) => {
            const data = doc.data();
            return { 
              id: doc.id, 
              ...data,
              // Make sure to include profileImageUrl if it exists in Firestore
              profileImageUrl: data.profileImageUrl || undefined
            } as BusPass;
          })
          .find((pass) => new Date(pass.endDate) >= now)

        if (activePass) {
          // Create or update the document in pass-cards collection
          const passCardRef = doc(db, "pass-cards", activePass.id)
          await setDoc(
            passCardRef,
            {
              passId: activePass.id,
              fullName: activePass.fullName,
              startDate: activePass.startDate,
              endDate: activePass.endDate,
              // Include profileImageUrl in the pass-cards collection
              profileImageUrl: activePass.profileImageUrl,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            },
            { merge: true }
          )

          setPass(activePass)
        }
      } catch (error) {
        console.error("Error fetching pass:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPass()
  }, [user])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className="space-y-6">
      <DashboardHeader title="View Pass" description="View your active digital bus pass" />

      {pass ? (
        // Pass both the pass object directly - it already contains the profileImageUrl if available
        <PassCard pass={pass} />
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border bg-card p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold">No Active Pass Found</h2>
          <p className="text-muted-foreground">You don't have an active bus pass. Create a new pass to continue.</p>
          <Button onClick={() => router.push("/dashboard/create-pass")}>Create New Pass</Button>
        </div>
      )}
    </div>
  )
}