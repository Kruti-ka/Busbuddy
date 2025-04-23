"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuth } from "@/lib/auth-context"
import { db } from "@/lib/firebase"
import { collection, addDoc, Timestamp } from "firebase/firestore"
import { DashboardHeader } from "@/components/dashboard-header"
import { HelpFaq } from "@/components/help-faq"
import { HelpContactForm } from "@/components/help-contact-form"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message is required"),
})

export default function Help() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      message: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!user) return

    try {
      setLoading(true)

      // Add support request to Firestore
      await addDoc(collection(db, "supportRequests"), {
        userId: user.uid,
        userEmail: user.email,
        subject: data.subject,
        message: data.message,
        status: "open",
        createdAt: Timestamp.now(),
      })

      toast({
        title: "Support request submitted",
        description: "We'll get back to you as soon as possible.",
        variant: "default",
      })

      form.reset()
    } catch (error) {
      console.error("Error submitting support request:", error)
      toast({
        title: "Error submitting request",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <DashboardHeader title="Help & Support" description="Get help with BusBuddy services" />

      <HelpFaq />

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Contact Support</h2>
        <HelpContactForm form={form} onSubmit={onSubmit} loading={loading} />
      </div>
    </div>
  )
}
