"use client"

import React, { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/shadcn/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shadcn/components/ui/card"
import { Input } from "@/shadcn/components/ui/input"
import { Label } from "@/shadcn/components/ui/label"
import { IRegisterIndividualForm, RegisterIndividualSchema } from "@/types/individual.t"
import { Select,SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/components/ui/select"
import { useCreateNewIndividual, useGetMetaRegistrationPayload } from "@/hooks/query/useIndividualQ"
import ServerRequestLoader from "@/components/loaders/server-request-loader"
import { AxiosError } from "axios"


export default function StudentRegistrationPage() {
  const {data,isPending} = useGetMetaRegistrationPayload()
  const { register, handleSubmit, control, formState: { errors },reset,} = useForm<IRegisterIndividualForm>({
    resolver: zodResolver(RegisterIndividualSchema),
    defaultValues:{photo: "https://res.cloudinary.com/dz8a9sztc/image/upload/v1711541749/students_dpw9qp.png",gender:"male"}
  })
  const {mutate,isPending:isCreating,isError,error} = useCreateNewIndividual(reset) 
  const Error = error as AxiosError<{message:string}>
  const onSubmit = (data: IRegisterIndividualForm) => {
    mutate(data)
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center  px-4">
      <Card className="w-full ">
        <CardHeader>
          <CardTitle className="text-2xl">Individual Registration</CardTitle>
          <CardDescription>Fill out the form below to register a new individual.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="bg-secondary py-2 rounded text-center">
        <h2 className="font-medium ">Personal Information</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  {...register("full_name")}
                  placeholder="John Doe"
                  aria-invalid={!!errors.full_name}
                  aria-describedby="full_name-error"
                />
                {errors.full_name && (
                  <p id="full_name-error" className="text-sm text-red-500">
                    {errors.full_name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="fatherName">Father Name * </Label>
                <Input
                  id="fatherName"
                  {...register("father_name")}
                  placeholder="Richard Doe"
                  aria-invalid={!!errors.father_name}
                  aria-describedby="father_name-error"
                />
                {errors.father_name && (
                  <p id="father_name-error" className="text-sm text-red-500">
                    {errors.father_name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth * </Label>
                <Input
                type="date"
                {...register("dob")}
                  id="dateOfBirth"
                  placeholder="Select date of birth"
                />
                {errors.dob && (
                  <p id="dob-error" className="text-sm text-red-500">
                    {errors.dob.message}
                  </p>
                )}
              </div>
          
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="john.doe@example.com"
                  aria-invalid={!!errors.email}
                  aria-describedby="email-error"
                />
                {errors.email && (
                  <p id="email-error" className="text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  {...register("contact")}
                  placeholder="03001234567"
                  aria-invalid={!!errors.contact}
                  aria-describedby="phone-error"
                />
                {errors.contact && (
                  <p id="contact-error" className="text-sm text-red-500">
                    {errors.contact.message}
                  </p>
                )}
              </div>
                <div className="space-y-2">
                <Label htmlFor="phone">Gender</Label>
                <Controller name="gender"  control={control} render={({field,fieldState})=>{
                    return (
                            <>
                        <Select  value={field.value} onValueChange={field.onChange} >
                  <SelectTrigger id="gender"  aria-describedby="gender-error" className="w-full">
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.error && (
                    <p id="contact-error" className="text-sm text-red-500">
                  {fieldState.error.message}
                  </p>
                )}
                </>
        ) }
    }
            />
              </div>
            </div>



            <div className="bg-secondary py-2 rounded text-center">
                <h2 className="font-medium ">Academic Information</h2>
            </div>


            <div className="grid gap-4 md:grid-cols-2">


              <div className="space-y-2">
                <Label htmlFor="grNo">GRNO * </Label>
                <Input
                  id="grNo"
type="number"
                  {...register("grno")}
                  placeholder="GR-001"
                  aria-invalid={!!errors.grno}
                  aria-describedby="grno-error"
                />
                {errors.grno && (
                  <p id="grno-error" className="text-sm text-red-500">
                    {errors.grno.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="rollNo">Roll No *</Label>
                <Input
                  id="rollNo"
                  {...register("roll_no")}
                  placeholder="R-001"
                  aria-invalid={!!errors.roll_no}
                  aria-describedby="roll_no-error"
                />
                {errors.roll_no && (
                  <p id="roll_no-error" className="text-sm text-red-500">
                    {errors.roll_no.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <div className="w-full flex gap-2 items-center">

                <Label htmlFor="className">Group * </Label>
                {
                    isPending &&
                    <ServerRequestLoader size={14}/>
                    }
                </div>

                <Controller name="group"  control={control} render={({field,fieldState})=>{
                    return (<>
                        <Select value={field.value} onValueChange={field.onChange} >
                  <SelectTrigger id="className"  aria-describedby="className-error" className="relative w-full">
                      <SelectValue placeholder="Select current group" />
                    
                  </SelectTrigger>
                  <SelectContent>
                            {
                                data?.payload.groups.map(e=>(<SelectItem value={e.id} key={e.id}>{e.name}</SelectItem>))
                            }
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <p id="className-error" className="text-sm text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
            
                    </>)
                }
            }/>
              </div> 

              <div className="space-y-2">
                <Label htmlFor="dateOfAdmission">Date of Admission *</Label>
                <Input type="date"
                {...register("doa")}
                  id="dateOfAdmission"
                  className="w-full "
                  placeholder="Select date of admission"
                />
                {errors.doa && (
                  <p id="doa-error" className="text-sm text-red-500">
                    {errors.doa.message}
                  </p>
                )}
              </div>
            </div>
                {
                  isError ? 

              <div className="mt-1 text-sm text-destructive" >
                <p>{Error.response?.data.message||"Registration failed"}</p>
              </div> :
              null
              }


            <CardFooter className="flex justify-end gap-2 p-0 ">
            <Button type="button" variant={"secondary"} onClick={()=>reset()}  >
                Reset
              </Button>
              <Button type="submit" disabled={isCreating} >
                {
                  isCreating ? <ServerRequestLoader/>: "Create"
                }
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
