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
import { cn } from "@/lib/utils"

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

  useEffect(() => {
    const startDate = form.watch("startDate")
    const validity = form.watch("validity")

    if (startDate && validity) {
      const validityDays = Number.parseInt(validity, 10)
      const calculatedEndDate = addDays(startDate, validityDays - 1)
      setEndDate(calculatedEndDate)
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
    <Card className="border-none shadow-none">
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <motion.div 
              variants={container} 
              initial="hidden" 
              animate="show" 
              className="grid gap-8 md:grid-cols-2"
            >
              {/* Personal Information Section */}
              <motion.div variants={item} className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold tracking-tight">Personal Information</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter your personal details for identification
                  </p>
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
                          className="focus-visible:ring-primary"
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
                          className="focus-visible:ring-primary"
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
                      <FormLabel>Emergency Contact Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+91 9876543210"
                          {...field}
                          className="focus-visible:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Route Information Section */}
              <motion.div variants={item} className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold tracking-tight">Route Information</h3>
                  <p className="text-sm text-muted-foreground">
                    Select your preferred travel route
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="focus-visible:ring-primary">
                            <SelectValue placeholder="Select boarding point" />
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
                          <SelectTrigger className="focus-visible:ring-primary">
                            <SelectValue placeholder="Select drop-off point" />
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
                          <SelectTrigger className="focus-visible:ring-primary">
                            <SelectValue placeholder="Select your route" />
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
                      className="gap-2"
                    >
                      <MapPin className="h-4 w-4" />
                      Share Location
                    </Button>
                    {userLocation && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-sm text-green-600"
                      >
                        Location captured
                      </motion.span>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Pass Details Section */}
            <motion.div 
              variants={container} 
              initial="hidden" 
              animate="show" 
              className="space-y-6"
            >
              <div className="space-y-2">
                <h3 className="text-lg font-semibold tracking-tight">Pass Details</h3>
                <p className="text-sm text-muted-foreground">
                  Configure your pass validity period
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
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
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
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
                        <FormLabel>Validity Period</FormLabel>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p className="text-sm">
                                Your pass allows unlimited travel during the validity period.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="focus-visible:ring-primary">
                            <SelectValue placeholder="Select validity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="7">7 days (₹500)</SelectItem>
                          <SelectItem value="15">15 days (₹900)</SelectItem>
                          <SelectItem value="30">30 days (₹1500)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input
                          value={endDate ? format(endDate, "PPP") : ""}
                          className="bg-muted/50"
                          readOnly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </motion.div>

            {/* Profile Photo Section */}
            <motion.div 
              variants={item} 
              initial="hidden" 
              animate="show" 
              className="space-y-6"
            >
              <div className="space-y-2">
                <h3 className="text-lg font-semibold tracking-tight">Profile Photo</h3>
                <p className="text-sm text-muted-foreground">
                  Upload a clear photo for your bus pass ID
                </p>
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

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="pt-4"
            >
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-current"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
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