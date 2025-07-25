"use client"
import React from 'react'
import { useState } from "react"
import { Button } from "@/shadcn/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/components/ui/card"
import { Input } from "@/shadcn/components/ui/input"
import { Label } from "@/shadcn/components/ui/label"
import { Building2, Sparkles, ArrowRight } from "lucide-react"
import { useRegisterOrganization } from '@/hooks/query/useOrganizationQ'
import ServerRequestLoader from '@/components/loaders/server-request-loader'



function GetStartedOrganizationAdmin() {
  const {mutate,isPending} = useRegisterOrganization()
  const [organizationName, setOrganizationName] = useState("")
  const handleContinue = () => {
    if (!organizationName) return;
    mutate(organizationName.trim())
  }

  return (
    <div className="min-h-screen flex items-center justify-center  p-4 relative overflow-hidden bg-background">

      <Card className="w-full max-w-md relative z-10  border-0   shadow-none">
        <CardHeader className="text-center  pt-8">
          <div className="mx-auto mb-4 w-16 h-16 bg-secondary  rounded-full flex items-center justify-center  transform transition-transform duration-300 hover:rotate-12">
            <Building2 className="w-8 h-8 " />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r  mb-2">
            Name Your Organization
          </CardTitle>
          <div className="flex items-center justify-center gap-2 mb-2">
            <CardDescription className="text-lg">Let's get started by setting up your organization</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pb-8">
           
            <div className="relative">
              <Input
                max={50}
                maxLength={50}
                autoFocus
                required
                id="organization-name"
                type="text"
                placeholder="Enter your organization name"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="w-full h-12 text-lg   transition-all duration-300 rounded-lg shadow-sm focus:shadow-md pl-4 pr-4 backdrop-blur-sm"
              />
            </div>
          
          <Button
            onClick={handleContinue}
            className="w-full h-12 text-lg font-semibold  transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl rounded-lg group"
            disabled={!organizationName || isPending}

          >

            {
              isPending ? <ServerRequestLoader/> :
            <span className="flex items-center gap-2">
              Continue
              <ArrowRight className={`w-5 h-5 transition-transform duration-300 hover:translate-x-1`} />
            </span>
            }
          </Button>
        </CardContent>
      </Card>

    </div>

  )
}

export default GetStartedOrganizationAdmin