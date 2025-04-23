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
  profileImage: z.any().optional(),
})

export default function Profile() {
  const { user, userProfile, updateUserProfile } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [currentImage, setCurrentImage] = useState<string | null>(null)

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
      if (userProfile.profileImageUrl) {
        setCurrentImage(userProfile.profileImageUrl)
      }
    } else if (user?.email) {
      form.setValue("email", user.email)
    }
    setLoading(false)
  }, [user, userProfile, form])

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!user) return

    try {
      setLoading(true)

      // Extract profile image file from form data
      const profileImageFile = data.profileImage instanceof File ? data.profileImage : null

      // Prepare update data
      const updateData = {
        fullName: data.fullName,
        email: data.email,
        mobile: data.mobile,
        gender: data.gender,
      }

      // Update user profile with potential image file
      await updateUserProfile(updateData, profileImageFile)

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
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className="space-y-6">
      <DashboardHeader title="Profile" description="Manage your account information" />
      <ProfileForm 
        form={form} 
        onSubmit={onSubmit} 
        currentImage={currentImage}
        loading={loading}
      />
    </div>
  )
}