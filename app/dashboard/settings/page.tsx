"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuth } from "@/lib/auth-context"
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth"
import { DashboardHeader } from "@/components/dashboard-header"
import { SettingsForm } from "@/components/settings-form"
import { LoadingScreen } from "@/components/loading-screen"
import { useToast } from "@/components/ui/use-toast"

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export default function Settings() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof passwordFormSchema>) => {
    if (!user) return

    try {
      setLoading(true)

      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(user.email!, data.currentPassword)

      await reauthenticateWithCredential(user, credential)

      // Update password
      await updatePassword(user, data.newPassword)

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
        variant: "default",
      })

      form.reset()
    } catch (error: any) {
      console.error("Error updating password:", error)

      let errorMessage = "There was an error updating your password. Please try again."

      if (error.code === "auth/wrong-password") {
        errorMessage = "Current password is incorrect."
      }

      toast({
        title: "Error updating password",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className="space-y-6">
      <DashboardHeader title="Settings" description="Manage your account settings" />
      <SettingsForm form={form} onSubmit={onSubmit} />
    </div>
  )
}
