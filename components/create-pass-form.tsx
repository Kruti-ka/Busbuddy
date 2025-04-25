"use client"

import { useState, useEffect } from "react"
import type { UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/image-upload"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, CreditCard, Calendar, Info } from "lucide-react"
import { motion } from "framer-motion"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, addDays } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Mock data for dropdowns
const ROUTES = [
  { id: "route1", name: "Route 101 - City Express" },
  { id: "route2", name: "Route 202 - Metro Connect" },
  { id: "route3", name: "Route 303 - Airport Shuttle" },
]

const LOCATIONS = [
  { id: "loc1", name: "Central Station" },
  { id: "loc2", name: "Tech Park" },
  { id: "loc3", name: "Airport Terminal" },
  { id: "loc4", name: "City Center" },
  { id: "loc5", name: "University Campus" },
]

interface CreatePassFormProps {
  form: UseFormReturn<any>
  onSubmit: (data: any) => void
  isProcessing?: boolean
}

export function CreatePassForm({ form, onSubmit, isProcessing = false }: CreatePassFormProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  // Calculate end date based on start date and validity
  useEffect(() => {
    const startDate = form.watch("startDate")
    const validity = form.watch("validity")

    if (startDate && validity) {
      // Convert validity to number and subtract 1 day
      const validityDays = Number.parseInt(validity, 10)
      const calculatedEndDate = addDays(startDate, validityDays - 1)
      setEndDate(calculatedEndDate)

      // Update the form's endDate field
      form.setValue("endDate", calculatedEndDate)
    }
  }, [form.watch("startDate"), form.watch("validity"), form])

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    } else {
      console.error("Geolocation is not supported by this browser.")
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <Card className="dashboard-card overflow-visible">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <motion.div variants={container} initial="hidden" animate="show" className="grid gap-8 md:grid-cols-2">
              <motion.div variants={item} className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-primary-red">Personal Information</h3>
                  <p className="text-sm text-neutral-text">Enter your personal details for the bus pass</p>
                </div>

                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          className="border-neutral-gray focus-visible:ring-accent-blue"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyContactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Contact Name"
                          {...field}
                          className="border-neutral-gray focus-visible:ring-accent-blue"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyContactMobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Mobile</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Contact Mobile"
                          {...field}
                          className="border-neutral-gray focus-visible:ring-accent-blue"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={item} className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-accent-blue">Route Information</h3>
                  <p className="text-sm text-neutral-text">Select your travel route details</p>
                </div>

                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-neutral-gray focus-visible:ring-accent-blue">
                            <SelectValue placeholder="Select source" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {LOCATIONS.map((location) => (
                            <SelectItem key={location.id} value={location.name}>
                              {location.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-neutral-gray focus-visible:ring-accent-blue">
                            <SelectValue placeholder="Select destination" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {LOCATIONS.map((location) => (
                            <SelectItem key={location.id} value={location.name}>
                              {location.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="route"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Route</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-neutral-gray focus-visible:ring-accent-blue">
                            <SelectValue placeholder="Select route" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ROUTES.map((route) => (
                            <SelectItem key={route.id} value={route.name}>
                              {route.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>Current Location</FormLabel>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGetLocation}
                      className="border-accent-blue text-accent-blue hover:bg-accent-blue/10"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Share Location
                    </Button>
                    {userLocation && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-sm text-accent-blue"
                      >
                        Location shared ✓
                      </motion.span>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-primary-red">Pass Details</h3>
                <p className="text-sm text-neutral-text">Select your pass validity period</p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={`w-full border-neutral-gray pl-3 text-left font-normal ${
                                !field.value && "text-muted-foreground"
                              }`}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <Calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="validity"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>Validity</FormLabel>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-neutral-text cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium">Daily Trip Limit</span>
                              </div>
                              <p className="text-xs">
                                🚌 You are allowed a maximum of 2 trips per day during the pass validity period.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-neutral-gray focus-visible:ring-accent-blue">
                            <SelectValue placeholder="Select validity period" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="7">7 days (₹500)</SelectItem>
                          <SelectItem value="15">15 days (₹900)</SelectItem>
                          <SelectItem value="30">30 days (₹1500)</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="mt-1 flex items-center gap-1">
                        <span className="text-xs text-neutral-text">🚌 Maximum 2 trips per day</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date (Auto-calculated)</FormLabel>
                      <FormControl>
                        <Input
                          value={endDate ? format(endDate, "PPP") : ""}
                          className="border-neutral-gray bg-neutral-gray/50 focus-visible:ring-accent-blue"
                          readOnly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </motion.div>

            <motion.div variants={item} initial="hidden" animate="show" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-accent-blue">Profile Photo</h3>
                <p className="text-sm text-neutral-text">Upload a clear photo for your bus pass</p>
              </div>

              <FormField
                control={form.control}
                name="profileImage"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <Button 
                type="submit" 
                className="w-full bg-primary-red hover:bg-primary-red/90 text-base-white"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Proceed to Payment
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}