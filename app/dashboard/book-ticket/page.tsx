"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuth } from "@/lib/auth-context"
import { db } from "@/lib/firebase"
import { collection, addDoc, Timestamp } from "firebase/firestore"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { DashboardHeader } from "@/components/dashboard-header"
import { BookTicketForm } from "@/components/book-ticket-form"
import { PaymentForm } from "@/components/payment-form"
import { LoadingScreen } from "@/components/loading-screen"
import { useToast } from "@/components/ui/use-toast"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51RFuatRjjeSC1PbTKPoYBcPCuLuKjIUm4ansQBe1ZPSgnZfmg839gVDFuiLlQG0N9zMSedFGIG3TLfrxbNpq3l5200J4WTTHEi",
)

const formSchema = z.object({
  source: z.string().min(1, "Source is required"),
  destination: z.string().min(1, "Destination is required"),
  route: z.string().min(1, "Route is required"),
  date: z.date({
    required_error: "Date is required",
  }),
  time: z.string().min(1, "Time is required"),
  passengers: z.number().min(1, "At least 1 passenger is required").max(10, "Maximum 10 passengers allowed"),
})

export default function BookTicket() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [ticketData, setTicketData] = useState<any>(null)
  const [amount, setAmount] = useState(0)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      source: "",
      destination: "",
      route: "",
      date: new Date(),
      time: "",
      passengers: 1,
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!user) return

    // Calculate fare based on route and passengers
    // This is a simplified calculation
    const baseFare = 50
    const calculatedAmount = baseFare * data.passengers

    setAmount(calculatedAmount)
    setTicketData(data)
    setShowPayment(true)
  }

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    if (!user || !ticketData) return

    try {
      setLoading(true)

      // Create ticket in Firestore
      const ticketRef = await addDoc(collection(db, "tickets"), {
        userId: user.uid,
        source: ticketData.source,
        destination: ticketData.destination,
        route: ticketData.route,
        date: ticketData.date.toISOString(),
        time: ticketData.time,
        passengers: ticketData.passengers,
        amount,
        paymentIntentId,
        status: "confirmed",
        createdAt: Timestamp.now(),
      })

      toast({
        title: "Ticket booked successfully!",
        description: "Your ticket has been confirmed.",
        variant: "default",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Error booking ticket:", error)
      toast({
        title: "Error booking ticket",
        description: "There was an error booking your ticket. Please try again.",
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
      <DashboardHeader title="Book Ticket" description="Book a bus ticket for your journey" />

      {showPayment ? (
        <div className="mx-auto max-w-md space-y-6 rounded-lg border bg-card p-6 shadow-sm">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold">Complete Payment</h2>
            <p className="text-muted-foreground">Amount to pay: ₹{amount.toFixed(2)}</p>
          </div>
          <Elements stripe={stripePromise}>
            <PaymentForm amount={amount} onSuccess={handlePaymentSuccess} onCancel={() => setShowPayment(false)} />
          </Elements>
        </div>
      ) : (
        <BookTicketForm form={form} onSubmit={onSubmit} />
      )}
    </div>
  )
}
