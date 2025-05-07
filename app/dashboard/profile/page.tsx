"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuth } from "@/lib/auth-context"
import { DashboardHeader } from "@/components/dashboard-header"
import { ProfileForm } from "@/components/profile-form"
import { LoadingScreen } from "@/components/loading-screen"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().min(10, "Valid mobile number is required"),
  gender: z.enum(["male", "female", "other"]),
})

export default function Profile() {
  const { user, userProfile, updateUserProfile } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      mobile: "",
      gender: "male",
    },
  })

  useEffect(() => {
    if (userProfile) {
      form.reset({
        fullName: userProfile.fullName || "",
        email: userProfile.email || "",
        mobile: userProfile.mobile || "",
        gender: userProfile.gender as "male" | "female" | "other" || "male",
      })
    } else if (user?.email) {
      form.setValue("email", user.email)
    }
    setIsLoading(false)
  }, [user, userProfile, form])

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!user) return

    console.log("Form submitted with data:", data)

    try {
      setIsSubmitting(true)

      const updateData = {
        fullName: data.fullName,
        email: data.email,
        mobile: data.mobile,
        gender: data.gender,
      }

      console.log("Sending update data:", updateData)

      await updateUserProfile(updateData)

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error updating profile",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="space-y-6">
      <DashboardHeader title="Profile" description="Manage your account information" />
      <ProfileForm 
        form={form} 
        onSubmit={onSubmit} 
        loading={isSubmitting}
      />
    </div>
  )
}
