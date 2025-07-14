"use client"

import Link from "next/link"
import { Button } from "@/shadcn/components/ui/button"
import { usePathname } from "next/navigation"

export function AuthNavbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 ">
      <div className="max-w-7xl mx-auto mt-3  px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-black font-bold text-lg">T</span>
            </div>
            <span className="text-white font-semibold text-xl group-hover: transition-colors">
              TipLogs
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex gap-2">

          <div className="flex items-center bg-secondary rounded-md px-4 py-2  space-x-4">
            <Link href="/auth/login">
              <Button variant={ pathname.includes("/login") ? "default" : "ghost"} className="cursor-pointer"
              >
                Login
              </Button>
            </Link>
            
          </div>

          <div className="flex items-center bg-secondary rounded-md px-4 py-2 space-x-4">
          
          <Link href="/auth/signup/user">
              <Button
              className="cursor-pointer"

                  variant={
                  pathname.includes("/signup/user") ? "default" : "ghost"
                }
              >
               Join Organization
              </Button>
            </Link>

            <Link href="/auth/signup/admin">
              <Button
              className="cursor-pointer"
                  variant={
                  pathname.includes("/signup/admin") ? "default" : "ghost"
                }
              >
               Create Organization
              </Button>
            </Link>
        </div>
          </div>


        </div>
      </div>

      {/* Subtle glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent /20 to-transparent"></div>
    </nav>
  )
}
