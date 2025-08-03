"use client"

import { Button } from "@/shadcn/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/components/ui/card"
import { Input } from "@/shadcn/components/ui/input"
import { Label } from "@/shadcn/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/components/ui/popover"
import { Calendar } from "@/shadcn/components/ui/calendar"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import moment from "moment"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/components/ui/select"
import { Controller, useForm } from "react-hook-form"
import { IselfRegisterSchema, SelfRegisterIndividualSchema } from "@/types/individual.t"
import { zodResolver } from "@hookform/resolvers/zod"
import { useVerifySelfIndividualRegistration } from "@/hooks/query/useOrganizationQ"
import ServerRequestLoader from "@/components/loaders/server-request-loader"
import ErrorPage from "@/components/error-page"
import { useRegisterSelfIndividualRequest } from "@/hooks/query/useIndividualQ"
import { AxiosError } from "axios"

export default function StudentRegistrationForm() {
  const {data,isPending,isError} = useVerifySelfIndividualRegistration()
  const {
    register,
    handleSubmit,
    formState: { errors},
    reset,
    control,
  } = useForm<IselfRegisterSchema>({
    resolver: zodResolver(SelfRegisterIndividualSchema),
  });
  const {mutate,isPending:isRegistering,error,isError:isRegisterError} = useRegisterSelfIndividualRequest(reset)
  const Error = error as AxiosError<{message:string}>
  const onSubmit = (data: IselfRegisterSchema) => {
    mutate({...data,dob:moment(data.dob).format("YYYY-MM-DD")})
  };
  if (isPending){
   return <Card className="w-full max-w-2xl mx-auto items-center justify-center flex" >
      <ServerRequestLoader size={32} stroke={4}/>
    </Card>
  }
  if (isError){
    return <div className="w-full">
      <ErrorPage message = "The page you're looking for is no longer available." />
      </div>
  }

  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <h1 className="py-2 text-2xl text-center font-medium"> {data.payload.organization.name} </h1>
        <CardTitle>Registration form</CardTitle>
        <CardDescription>Please fill out the form below to register yourself into {data.payload.organization.name}.</CardDescription>
      </CardHeader>
      <CardContent >
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input {...register("full_name")} id="fullName" placeholder="Enter full name" required />
              {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="fatherName">Father's Name</Label>
              <Input {...register("father_name")} id="fatherName" placeholder="Enter father's name" required />
              {errors.father_name && <p className="text-red-500 text-sm">{errors.father_name.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cnic">CNIC</Label>
              <Input {...register("cnic")} type="number" id="cnic" placeholder="e.g., 12345-6789012-3" required />
              {errors.cnic && <p className="text-red-500 text-sm">{errors.cnic.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input {...register("email")} id="email" type="email" placeholder="Enter email address" />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input id="contactNumber" {...register("contact")} placeholder="e.g., +923001234567" required />
              {errors.contact && <p className="text-red-500 text-sm">{errors.contact.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="gender" className="w-full">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Controller
                control={control}
                name="dob"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value
                          ? moment(field.value).format("dddd, D MMMM YYYY")
                          : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.dob && <p className="text-red-500 text-sm">{errors.dob.message}</p>}
            </div>
          </div>
          {
            isRegisterError && <p className="text-red-500 text-sm">{Error.response?.data.message||"Internal server error"}</p>
          }
<div className="flex gap-2 items-center justify-end">
     <Button type="button" variant="secondary" onClick={()=>reset()}  disabled={isRegistering}>
            Reset
          </Button>
          <Button type="submit" disabled={isRegistering} >
            { isRegistering ? <ServerRequestLoader/> : "Register"}
          </Button>
</div>
        </form>
      </CardContent>
    </Card>
  );
}
