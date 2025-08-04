import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/components/ui/card"
import { Input } from "@/shadcn/components/ui/input"
import { Label } from "@/shadcn/components/ui/label"
import { useGetSelfRegistrationRequestDetails } from '@/hooks/query/useIndividualQ'
import { Badge } from '@/shadcn/components/ui/badge'
import clsx from 'clsx'
import RequestAcedmicDetailsForm from './request-details-form'
import { Separator } from '@/shadcn/components/ui/separator'
import { Button } from '@/shadcn/components/ui/button'
import { Trash, X } from 'lucide-react'
import RejectButtons from './reject-buttons'

function RequestDetails() {
  const {data:Data} = useGetSelfRegistrationRequestDetails(false)
  const d = Data?.payload.details
  return (
    <Card>
    
      <CardHeader>
          <div className="flex justify-between">
            <div className="">
        <CardTitle>Individual Registration Request</CardTitle>
        <CardDescription>Review the details of the student's registration application.</CardDescription>
            </div>
            <div className="flex gap-2 items-center justify-center">
            <Badge className={clsx('rounded-md ',!d?.is_approved && (d?.is_rejected ? "bg-red-400 text-black": "bg-gray-300 ") )}>
              {  d?.is_rejected ? "Rejected":"Pending"}
            </Badge>
            <Separator orientation='vertical'/>

            <RejectButtons/>
            </div>

        </div>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={d?.full_name}    readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Father Name</Label>
            <Input id="name" value={d?.father_name}    readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">CNIC</Label>
            <Input id="name" type='number' value={d?.cnic ?? ""}    readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact">Contact</Label>
            <Input id="contact " type="number" value={d?.contact ?? ""} defaultValue="john.doe@example.com" readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={d?.email ?? ""} defaultValue="john.doe@example.com" readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input id="dob" type="date" value={d?.dob ?? ""} defaultValue="2000-01-15" readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Gender</Label>
            <Input id="phone" value={d?.gender} readOnly />
          </div>
        </div>
    
    <RequestAcedmicDetailsForm/>
    

      </CardContent>
    </Card>
  )
}

export default RequestDetails