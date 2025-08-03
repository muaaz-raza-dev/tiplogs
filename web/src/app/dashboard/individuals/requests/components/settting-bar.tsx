"use client"
import React, { useEffect, useState } from 'react'
import { Input } from "@/shadcn/components/ui/input"
import { Switch } from "@/shadcn/components/ui/switch"
import { Label } from "@/shadcn/components/ui/label"
import { Copy,  Settings } from "lucide-react"
import { Button } from '@/shadcn/components/ui/button'
import { useFetchIndividualAutoRegistrationStatus, useGetIndividualAutoRegistrationStatus } from '@/hooks/query/useOrganizationQ'
import ServerRequestLoader from '@/components/loaders/server-request-loader'
import toast from 'react-hot-toast'

function SettingBar() {
    const {data,isPending,refetch} = useGetIndividualAutoRegistrationStatus()
    const{mutate,isPending:isToggling,data:UpdatedData}=useFetchIndividualAutoRegistrationStatus(onSuccess)
    const [status,setStatus] = useState<boolean>(false)

    useEffect(() => {
    if (data){
        setStatus(data.payload.status)
    }
    }, [data])
    function onSuccess(){
        setStatus(UpdatedData?.payload.status || false)
        refetch()
    }
    const copyToClipboard = () => {
    if (data?.payload.token) {
      navigator.clipboard.writeText(`${window.location.origin}/auth/register/org/${data.payload.token}`)
      toast.success("Url is copied to your clipboard")
    }
  }
  function ontoggle(t:boolean){
    setStatus(t)
    mutate(t)
  }
  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg shadow-sm w-full bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="registration-toggle" className="text-sm font-medium">
                  Enable Registration Requests
                </Label>
              </div>
              {
                isPending ?
                <ServerRequestLoader size={28} stroke={3}/> 
                :
                <Switch
                disabled={isToggling}
                checked={status}
                onCheckedChange={ontoggle}
                id="registration-toggle"
                className='cursor-pointer'
                aria-label="Toggle individual registration requests"
                />
            }
            </div>
            <p className="text-sm text-muted-foreground">
              Toggle this switch to enable or disable new individual registration requests.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
              <Button  className=" sm:w-auto">
                Generate Public Form URL
              </Button>
              <div className="flex items-center space-x-2 ">

                <Input readOnly value={ data?.payload.status ? `${window.location.origin}/auth/register/org/${data.payload.token}` :"URL will appear here"} className="flex-1" />
                <Button variant="ghost" size="icon" onClick={copyToClipboard} >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy URL</span>
                </Button>

              </div>
            </div>
          </div>
  )
}

export default SettingBar