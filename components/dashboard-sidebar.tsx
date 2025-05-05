"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CreditCard, Home, LogOut, Menu, QrCode, MapPin, Bell, User, HelpCircle, Settings } from "lucide-react"
import { motion } from "framer-motion"

export function DashboardSidebar() {
  const { user, userProfile, logOut } = useAuth()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const routes = [
    {
      icon: Home,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: QrCode,
      label: "Create Pass",
      href: "/dashboard/create-pass",
    },
    {
      icon: QrCode,
      label: "View Pass",
      href: "/dashboard/view-pass",
    },
    {
      icon: MapPin,
      label: "Track Bus",
      href: "/dashboard/track-bus",
    },
    {
      icon: CreditCard,
      label: "Book Ticket",
      href: "/dashboard/book-ticket",
    },
    {
      icon: Bell,
      label: "Notifications",
      href: "/dashboard/notifications",
    },
    {
      icon: User,
      label: "Profile",
      href: "/dashboard/profile",
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      href: "/dashboard/help",
    },
    {
      icon: Settings,
      label: "Settings",
      href: "/dashboard/settings",
    },
  ]

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="outline" size="icon" className="absolute right-4 top-4 border-primary text-primary">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="border-r-neutral-gray bg-base-white p-0">
          <div className="flex h-full flex-col">
            <div className="border-b border-neutral-gray p-4">
              <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-black">BUS</span>
              <span className="text-xl font-bold text-primary"> BUDDY</span>
              </div>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid gap-1 px-2">
                {routes.map((route, index) => {
                  const isActive = pathname === route.href;
                  const isPrimary = index % 2 === 0;
                  
                  return (
                    <Link
                      key={route.href}
                      href={route.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                        isActive
                          ? isPrimary
                            ? "bg-primary/90 text-white shadow-sm"
                            : "bg-secondary/90 text-white shadow-sm"
                          : "text-neutral-dark hover:bg-neutral-gray"
                      }`}
                    >
                      <route.icon className={`h-4 w-4 ${isActive ? "text-white" : ""}`} />
                      <span className={isActive ? "font-semibold" : ""}>{route.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="border-t border-neutral-gray p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-9 w-9 border-2 border-secondary">
                  <AvatarImage
                    src={userProfile?.profileImageUrl || "/placeholder.svg"}
                    alt={userProfile?.fullName || user?.email || ""}
                  />
                  <AvatarFallback className="bg-primary text-base-white">
                    {userProfile?.fullName?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{userProfile?.fullName || user?.email?.split("@")[0]}</span>
                  <span className="text-xs text-neutral-text">{user?.email}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => logOut()}
                  className="ml-auto text-primary hover:bg-primary/10 hover:text-primary"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">Log out</span>
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="hidden border-r border-neutral-gray bg-base-white md:block md:w-64">
        <div className="flex h-full flex-col">
          <div className="border-b border-neutral-gray p-4">
            <div className="flex items-center gap-2">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="text-xl font-bold text-primary"
              >
                BusBuddy
              </motion.span>
            </div>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid gap-1 px-2">
              {routes.map((route, index) => {
                const isActive = pathname === route.href;
                const isPrimary = index % 2 === 0;
                
                return (
                  <motion.div
                    key={route.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link
                      href={route.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                        isActive
                          ? isPrimary
                            ? "bg-primary/90 text-white shadow-sm"
                            : "bg-secondary/90 text-white shadow-sm"
                          : "text-neutral-dark hover:bg-neutral-gray"
                      }`}
                    >
                      <route.icon className={`h-4 w-4 ${isActive ? "text-white" : ""}`} />
                      <span className={isActive ? "font-semibold" : ""}>{route.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </div>
          <div className="border-t border-neutral-gray p-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-9 w-9 border-2 border-secondary">
                <AvatarImage
                  src={userProfile?.profileImageUrl || "/placeholder.svg"}
                  alt={userProfile?.fullName || user?.email || ""}
                />
                <AvatarFallback className="bg-primary text-base-white">
                  {userProfile?.fullName?.charAt(0) || user?.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{userProfile?.fullName || user?.email?.split("@")[0]}</span>
                <span className="text-xs text-neutral-text">{user?.email}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => logOut()}
                className="ml-auto text-primary hover:bg-primary/10 hover:text-primary"
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Log out</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}