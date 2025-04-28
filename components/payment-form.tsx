"use client"

import type React from "react"

import { useState } from "react"
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CreditCard, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

interface PaymentFormProps {
  amount: number
  onSuccess: (paymentIntentId: string) => void
  onCancel: () => void
}

export function PaymentForm({ amount, onSuccess, onCancel }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      // In a real implementation, you would create a payment intent on the server
      // For demo purposes, we'll simulate a successful payment
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate a payment intent ID
      const paymentIntentId = `pi_${Math.random().toString(36).substring(2, 15)}`

      onSuccess(paymentIntentId)
    } catch (err: any) {
      console.error("Payment error:", err)
      setError(err.message || "An error occurred during payment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Alert className="bg-neutral-gray border-primary-red/30">
          <AlertCircle className="h-4 w-4 text-primary-red" />
          <AlertTitle className="text-primary-red">Test Payment Information</AlertTitle>
          <AlertDescription className="text-sm">
            <p>Use the following test card for demo payments:</p>
            <ul className="mt-2 space-y-1 text-neutral-text">
              <li>Card Number: 4242 4242 4242 4242</li>
              <li>CVC: 123</li>
              <li>Expiry Date: Any future date</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="rounded-md border border-neutral-gray bg-base-white p-4 shadow-sm">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#333333",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#FE3F40",
                },
              },
            }}
          />
        </div>
        {error && (
          <Alert variant="destructive" className="bg-primary-red/10 border-primary-red text-primary-red">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Payment Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1 border-accent-blue text-accent-blue hover:bg-accent-blue/10"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          disabled={!stripe || loading}
        >
          {loading ? (
            <motion.div className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Processing...
            </motion.div>
          ) : (
            <span className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Pay ₹{amount.toFixed(2)}
            </span>
          )}
        </Button>
      </div>
    </form>
  )
}
