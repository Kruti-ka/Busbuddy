// Fixed page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuth } from "@/lib/auth-context"
import { db } from "@/lib/firebase"
import { collection, addDoc, Timestamp, getDocs, query, where, orderBy } from "firebase/firestore"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { DashboardHeader } from "@/components/dashboard-header"
import { BookTicketForm } from "@/components/book-ticket-form"
import { PaymentForm } from "@/components/payment-form"
import { TicketView } from "@/components/ticket-view"
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
  // Auto refresh at midnight to update view
  useEffect(() => {
    // Check if we need to switch from ticket view to booking form at midnight
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(now.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    
    const timeUntilMidnight = tomorrow.getTime() - now.getTime()
    console.log(`Setting up midnight refresh in ${timeUntilMidnight}ms`)
    
    // Set a timeout to refresh the page at midnight
    const midnightTimeout = setTimeout(() => {
      window.location.reload()
    }, timeUntilMidnight)
    
    return () => clearTimeout(midnightTimeout)
  }, [])

  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [showPayment, setShowPayment] = useState(false)
  const [ticketData, setTicketData] = useState<any>(null)
  const [currentTicket, setCurrentTicket] = useState<any>(null)
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

  // Function to safely parse date strings
  const parseDateString = (dateStr: string) => {
    try {
      return new Date(dateStr);
    } catch (e) {
      console.error(`Error parsing date string: ${dateStr}`, e);
      return new Date(); // Return current date as fallback
    }
  };

  // Check if user already has a ticket for today
  useEffect(() => {
    const checkExistingTicket = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        console.log("Checking for existing tickets...")
        
        // Get today's date at midnight for comparison
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const todayStr = today.toISOString().split('T')[0] // YYYY-MM-DD format
        
        console.log(`Today's date (for comparison): ${todayStr}`)
        
        // Simplified query that won't require a composite index
        // We'll filter for today's tickets in the code instead
        const ticketsRef = collection(db, "tickets")
        const q = query(
          ticketsRef,
          where("userId", "==", user.uid),
          where("status", "==", "confirmed")
        )

        const querySnapshot = await getDocs(q)
        console.log(`Found ${querySnapshot.size} tickets total`)
        
        if (!querySnapshot.empty) {
          // Check all tickets to find one for today
          for (const doc of querySnapshot.docs) {
            const ticketData = doc.data()
            const ticket = { 
              id: doc.id,
              date: ticketData.date, // Ensure the date field is explicitly included
              ...ticketData
            }
            
            console.log(`Raw ticket date: ${ticket.date}`)
            
            // Parse the date string from the ticket with error handling
            try {
              // Parse the date string from the ticket
              const ticketDate = parseDateString(ticket.date)
              ticketDate.setHours(0, 0, 0, 0)
              const ticketDateStr = ticketDate.toISOString().split('T')[0]
              
              console.log(`Checking ticket: ${doc.id}, date: ${ticketDateStr}`)
              
              // If we find a ticket for today, show it
              if (ticketDateStr === todayStr) {
                console.log(`Found valid ticket for today: ${doc.id}`)
                setCurrentTicket(ticket)
                break
              } else {
                console.log(`Ticket date ${ticketDateStr} doesn't match today ${todayStr}`)
              }
            } catch (error) {
              console.error(`Error processing ticket date for ticket ${doc.id}:`, error)
            }
          }
        }
      } catch (error) {
        console.error("Error checking existing ticket:", error)
      } finally {
        setLoading(false)
      }
    }

    checkExistingTicket()
  }, [user])

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!user) return

    // Validate that source and destination are different
    if (data.source === data.destination) {
      toast({
        title: "Invalid selection",
        description: "Source and destination cannot be the same",
        variant: "destructive",
      })
      return
    }

    // Calculate fare based on route and passengers
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

      // Get today's date and set time to midnight for consistent comparison
      const bookingDate = new Date(ticketData.date)
      bookingDate.setHours(0, 0, 0, 0)
      
      // Store the ISO string for the date
      const dateIsoString = bookingDate.toISOString()
      console.log(`Storing ticket with date: ${dateIsoString}`)

      // Create ticket in Firestore
      const ticketRef = await addDoc(collection(db, "tickets"), {
        userId: user.uid,
        source: ticketData.source,
        destination: ticketData.destination,
        route: ticketData.route,
        date: dateIsoString, // Store as ISO string for consistent retrieval
        time: ticketData.time,
        passengers: ticketData.passengers,
        amount,
        paymentIntentId,
        status: "confirmed",
        createdAt: Timestamp.now(),
      })

      // Get the newly created ticket with its ID
      const newTicket = {
        id: ticketRef.id,
        userId: user.uid,
        source: ticketData.source,
        destination: ticketData.destination,
        route: ticketData.route,
        date: dateIsoString,
        time: ticketData.time,
        passengers: ticketData.passengers,
        amount,
        paymentIntentId,
        status: "confirmed",
        createdAt: Timestamp.now(),
      }

      setCurrentTicket(newTicket)
      
      toast({
        title: "Ticket booked successfully!",
        description: "Your ticket has been confirmed.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error booking ticket:", error)
      toast({
        title: "Error booking ticket",
        description: "There was an error booking your ticket. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setShowPayment(false)
    }
  }

  // We don't need this function anymore since we're removing the "Book Again" button
  // But keeping it in case we want to reintroduce this functionality later
  const handleBookAgain = () => {
    setCurrentTicket(null)
    form.reset({
      source: "",
      destination: "",
      route: "",
      date: new Date(),
      time: "",
      passengers: 1,
    })
  }

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className="space-y-6">
      <DashboardHeader title="Bus Ticket" description="Your digital transit pass" />

      {currentTicket ? (
        <TicketView ticket={currentTicket} onBookAgain={handleBookAgain} />
      ) : showPayment ? (
        <div className="mx-auto max-w-md space-y-6 rounded-lg border bg-card p-6 shadow-sm">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold">Complete Payment</h2>
            <p className="text-muted-foreground">Amount to pay: ₹{amount.toFixed(2)}</p>
          </div>
          <Elements stripe={stripePromise}>
            <PaymentForm 
              amount={amount} 
              onSuccess={handlePaymentSuccess} 
              onCancel={() => setShowPayment(false)} 
            />
          </Elements>
        </div>
      ) : (
        <BookTicketForm form={form} onSubmit={onSubmit} />
      )}
    </div>
  )
}