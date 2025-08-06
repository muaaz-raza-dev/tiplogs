'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useEffect, useState } from 'react'

import { Button } from "@/shadcn/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shadcn/components/ui/card"
import { Input } from "@/shadcn/components/ui/input"
import { Label } from "@/shadcn/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/components/ui/select"
import { Textarea } from "@/shadcn/components/ui/textarea"
import { MultiSelectGroups } from "./components/multi-select-group"
import { CreateAttModuleformSchema, ICreateAttModuleform } from '@/types/att_module'
import { useCreateAttModule } from '@/hooks/query/useAttModuleQ'
import ServerRequestLoader from '@/components/loaders/server-request-loader'





export default function AttendanceRegistrationPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset,
    } = useForm<ICreateAttModuleform>({
        resolver: zodResolver(CreateAttModuleformSchema),
        defaultValues: {
            name: "",
            description: "",
            frequency: "daily",
            groups: [],
        }
    })
    const {mutate,isPending} = useCreateAttModule(reset)

  const selectedGroups = watch("groups")

  const onSubmit = (data: ICreateAttModuleform) => {
    mutate(data)
  }

  const handleGroupsChange = (groups: string[]) => {
    setValue("groups", groups, { shouldValidate: true })
  }

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className='mb-4  border-b'>
            <CardTitle>Register Attendance Module</CardTitle>
            <CardDescription>Fill in the details for your new attendance module.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Module Name</Label>
              <Input id="name" {...register("name")} placeholder="e.g., Daily Standup Attendance" />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register("description")} placeholder="Briefly describe this attendance module" className="min-h-[100px]" />
              {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Attendance Frequency</Label>
              <Select
                onValueChange={(value) => setValue("frequency", value as "daily" | "custom", { shouldValidate: true })}
              >
                <SelectTrigger id="frequency" className='w-full'>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="custom">Custom </SelectItem>
                </SelectContent>
              </Select>
              {errors.frequency && <p className="text-sm text-red-500">{errors.frequency.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="groups">Select Groups</Label>
              <MultiSelectGroups selectedGroups={selectedGroups} onGroupsChange={handleGroupsChange} />
              {errors.groups && <p className="text-sm text-red-500">{errors.groups.message}</p>}
            </div>
          </CardContent>
          <CardFooter className='flex justify-end gap-2 mt-4'>
            <Button disabled={isPending} type="button" variant="secondary" onClick={() => reset()}>Reset</Button>
            <Button disabled={isPending} type="submit">{isPending?<ServerRequestLoader/>:"Register Module"}</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
