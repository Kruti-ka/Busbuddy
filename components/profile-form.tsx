"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Save, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

interface ProfileFormProps {
  form: any
  onSubmit: (data: any) => void
  loading?: boolean
}

export function ProfileForm({ form, onSubmit, loading }: ProfileFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Edit Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    placeholder="John Doe"
                    {...form.register("fullName", { required: "Full name is required" })}
                    className="mt-1"
                  />
                  {form.formState.errors.fullName && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <FormLabel>Email</FormLabel>
                  <Input
                    placeholder="your.email@example.com"
                    {...form.register("email")}
                    disabled
                    className="mt-1 bg-gray-50"
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <FormLabel>Mobile Number</FormLabel>
                  <Input
                    placeholder="1234567890"
                    {...form.register("mobile", { required: "Mobile number is required" })}
                    className="mt-1"
                  />
                  {form.formState.errors.mobile && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.mobile.message}
                    </p>
                  )}
                </div>

                <div>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={(value) => form.setValue("gender", value)}
                    defaultValue={form.getValues("gender")}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.gender && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.gender.message}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
