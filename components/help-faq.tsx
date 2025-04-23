"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function HelpFaq() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Frequently Asked Questions</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How do I create a digital bus pass?</AccordionTrigger>
            <AccordionContent>
              To create a digital bus pass, navigate to the "Create Pass" section in your dashboard. Fill in the
              required details, upload your photo, select your preferred validity period, and complete the payment. Your
              digital pass will be generated instantly.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>How does the QR code validation work?</AccordionTrigger>
            <AccordionContent>
              Your digital pass includes a unique QR code that contains encrypted information about your pass. Bus
              conductors can scan this QR code using the BusBuddy verification app to validate your pass. The QR code
              changes periodically for security.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Can I have multiple active passes at once?</AccordionTrigger>
            <AccordionContent>
              No, you can only have one active pass at a time. If you need to create a new pass with different routes or
              validity, you'll need to wait until your current pass expires.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>How accurate is the bus tracking feature?</AccordionTrigger>
            <AccordionContent>
              Our bus tracking feature provides real-time location updates with an accuracy of approximately 50-100
              meters. The estimated arrival times are calculated based on current traffic conditions and historical
              data, with an average accuracy of ±3 minutes.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>What payment methods are accepted?</AccordionTrigger>
            <AccordionContent>
              We accept all major credit and debit cards, UPI payments, and digital wallets. All payments are processed
              securely through our payment gateway partner, Stripe.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6">
            <AccordionTrigger>How do I get a refund for an unused pass?</AccordionTrigger>
            <AccordionContent>
              Refunds for unused passes can be requested within 24 hours of purchase. Please contact our support team
              with your pass details. Partial refunds for partially used passes are not available.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-7">
            <AccordionTrigger>What should I do if my pass is not scanning properly?</AccordionTrigger>
            <AccordionContent>
              If your pass is not scanning properly, ensure your screen brightness is at maximum and the QR code is
              fully visible. If the issue persists, you can regenerate the QR code from the "View Pass" section or
              contact our support team for assistance.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
