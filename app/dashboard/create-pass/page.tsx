"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuth } from "@/lib/auth-context"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, addDoc, Timestamp } from "firebase/firestore"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { DashboardHeader } from "@/components/dashboard-header"
import { CreatePassForm } from "@/components/create-pass-form"
import { PaymentForm } from "@/components/payment-form"
import { LoadingScreen } from "@/components/loading-screen"
import { useToast } from "@/components/ui/use-toast"
import { uploadImageToCloudinary } from "@/lib/cloudinary"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51RFuatRjjeSC1PbTKPoYBcPCuLuKjIUm4ansQBe1ZPSgnZfmg839gVDFuiLlQG0N9zMSedFGIG3TLfrxbNpq3l5200J4WTTHEi",
)

const formSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  emergencyContactName: z.string().min(2, "Emergency contact name is required"),
  emergencyContactMobile: z.string().min(10, "Valid mobile number is required"),
  validity: z.enum(["7", "15", "30"]),
  source: z.string().min(1, "Source is required"),
  destination: z.string().min(1, "Destination is required"),
  route: z.string().min(1, "Route is required"),
  startDate: z.date(),
  endDate: z.date().optional(),
  profileImage: z.any().optional(),
})

export default function CreatePass() {
  const { user, userProfile } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [hasActivePass, setHasActivePass] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [passData, setPassData] = useState<z.infer<typeof formSchema> | null>(null)
  const [amount, setAmount] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      emergencyContactName: "",
      emergencyContactMobile: "",
      validity: "30",
      source: "",
      destination: "",
      route: "",
      startDate: new Date(),
    },
  })

  useEffect(() => {
    const checkActivePass = async () => {
      if (!user) return

      try {
        const now = new Date()
        const passesQuery = query(collection(db, "passes"), where("userId", "==", user.uid))
        const passesSnapshot = await getDocs(passesQuery)

        const activePass = passesSnapshot.docs.find((doc) => {
          const data = doc.data()
          return new Date(data.endDate) >= now
        })

        if (activePass) {
          setHasActivePass(true)
          toast({
            title: "Active pass found",
            description: "You already have an active pass. Redirecting to view pass.",
            variant: "default",
          })
          setTimeout(() => router.push("/dashboard/view-pass"), 2000)
        }

        if (userProfile) {
          form.setValue("fullName", userProfile.fullName || "")
        }
      } catch (error) {
        console.error("Error checking active pass:", error)
      } finally {
        setLoading(false)
      }
    }

    checkActivePass()
  }, [user, userProfile, router, form, toast])

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!user) return
    
    setIsProcessing(true)
    
    try {
      let calculatedAmount = 0
      switch (data.validity) {
        case "7":
          calculatedAmount = 500
          break
        case "15":
          calculatedAmount = 900
          break
        case "30":
          calculatedAmount = 1500
          break
      }

      setAmount(calculatedAmount)
      setPassData(data)
      setShowPayment(true)
    } catch (error) {
      console.error("Error processing form:", error)
      toast({
        title: "Error",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    if (!user || !passData) return;

    try {
      setLoading(true);
      toast({
        title: "Processing",
        description: "Creating your pass and uploading image...",
        variant: "default",
      });

      let profileImageUrl = null;
      
      if (passData.profileImage) {
        if (passData.profileImage instanceof File) {
          try {
            profileImageUrl = await uploadImageToCloudinary(passData.profileImage);
          } catch (uploadError) {
            console.error("Image upload failed:", uploadError);
            toast({
              title: "Image Upload Failed",
              description: "We couldn't upload your profile image, but will continue creating your pass.",
              variant: "default",
            });
          }
        } else if (typeof passData.profileImage === 'string') {
          profileImageUrl = passData.profileImage;
        }
      }

      const startDate = passData.startDate || new Date();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + Number.parseInt(passData.validity));

      const passObject = {
        userId: user.uid,
        fullName: passData.fullName,
        emergencyContactName: passData.emergencyContactName,
        emergencyContactMobile: passData.emergencyContactMobile,
        validity: passData.validity,
        source: passData.source,
        destination: passData.destination,
        route: passData.route,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        amount,
        paymentIntentId,
        createdAt: Timestamp.now(),
        profileImageUrl: profileImageUrl,
      };

      await addDoc(collection(db, "passes"), passObject);

      toast({
        title: "Pass created successfully!",
        description: "Your digital bus pass has been created.",
        variant: "default",
      });

      router.push("/dashboard/view-pass");
    } catch (error) {
      console.error("Error creating pass:", error);
      toast({
        title: "Error creating pass",
        description: "There was an error creating your pass. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen />
  }

  if (hasActivePass) {
    return (
      <div className="flex min-h-[calc(100vh-140px)] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">Redirecting...</h2>
          <p className="mt-2 text-muted-foreground">You already have an active pass. Taking you to view pass.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <DashboardHeader 
        title="Create New Bus Pass" 
        description="Fill in your details to create a digital bus pass" 
      />

      {showPayment ? (
        <div className="mx-auto max-w-2xl">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="mb-8 space-y-1 text-center">
              <h2 className="text-2xl font-bold tracking-tight">Complete Payment</h2>
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
        </div>
      ) : (
        <CreatePassForm form={form} onSubmit={onSubmit} isProcessing={isProcessing} />
      )}
    </div>
  )
}