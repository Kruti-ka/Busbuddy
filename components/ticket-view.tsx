// ticket-view.tsx
"use client"

import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Bus, Calendar, Clock, Map, MapPin, Users } from "lucide-react"

interface TicketViewProps {
  ticket: {
    id: string
    source: string
    destination: string
    route: string
    date: string
    time: string
    passengers: number
    amount: number
    status: string
  }
  onBookAgain: () => void
}

export function TicketView({ ticket, onBookAgain }: TicketViewProps) {
  // Safely parse the date with error handling
  const parseTicketDate = (dateStr: string): Date => {
    try {
      return new Date(dateStr);
    } catch (e) {
      console.error("Error parsing date:", e);
      return new Date(); // Return current date as fallback
    }
  }
  
  // Get ticket date and today's date for comparison
  const ticketDate = parseTicketDate(ticket.date);
  
  // Set both dates to midnight for proper comparison
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const ticketDay = new Date(ticketDate)
  ticketDay.setHours(0, 0, 0, 0)
  
  // Ticket is expired if the ticket date is before today
  const isExpired = ticketDay < today
  
  // Safe date formatting with fallback
  const formatTicketDate = (date: Date): string => {
    try {
      return format(date, "dd MMM yyyy");
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Invalid Date";
    }
  }
  
  return (
    <Card className="mx-auto max-w-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-[#25C199] to-[#3DD9AC] pb-8 pt-6">

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-black">Bus Ticket</h3>
            <p className="text-xs text-black/80">#{ticket.id.substring(0, 8).toUpperCase()}</p>
          </div>
          <div className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium uppercase text-white">
            {ticket.status}
          </div>
        </div>
      </CardHeader>
      
      <div className="relative">
        <div className="absolute -top-4 -left-4 h-8 w-8 rounded-full bg-background"></div>
        <div className="absolute -top-4 -right-4 h-8 w-8 rounded-full bg-background"></div>
        <Separator className="border-dashed border-gray-200" />
      </div>
      
      <CardContent className="pt-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">From</p>
            <h4 className="font-medium">{ticket.source}</h4>
          </div>
          
          <div className="flex-1 px-4">
            <div className="flex items-center justify-center">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <div className="mx-2 h-[1px] flex-1 bg-gray-300"></div>
              <Bus className="h-4 w-4 text-green-500" />
              <div className="mx-2 h-[1px] flex-1 bg-gray-300"></div>
              <MapPin className="h-3 w-3 text-muted-foreground" />
            </div>
            <p className="mt-1 text-center text-xs text-muted-foreground">{ticket.route}</p>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground">To</p>
            <h4 className="font-medium">{ticket.destination}</h4>
          </div>
        </div>
        
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="font-medium">{formatTicketDate(ticketDate)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="font-medium">{ticket.time}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">Passengers</p>
              <p className="font-medium">{ticket.passengers}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Map className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">Amount Paid</p>
              <p className="font-medium">₹{ticket.amount.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        {isExpired && (
          <div className="mb-4 rounded-md bg-amber-50 p-3 text-amber-800">
            <p className="text-sm font-medium">This ticket was for a past date</p>
            <p className="text-xs">Tickets are valid only for the date of journey</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-2 bg-gray-50 px-6 py-4">
        <div className="text-center text-sm">
          {isExpired ? (
            <p className="font-medium text-amber-600">This ticket has expired</p>
          ) : (
            <>
              <p className="font-medium text-green-600">Ticket Valid for Today</p>
              <p className="mt-1 text-xs text-muted-foreground">Show this ticket during boarding</p>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}