"use client";

import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shadcn/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shadcn/components/ui/card";
import { Input } from "@/shadcn/components/ui/input";
import { Label } from "@/shadcn/components/ui/label";
import {
  IRegisterIndividualForm,
  RegisterIndividualSchema,
} from "@/types/individual.t";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/components/ui/select";
import {
  useCreateNewIndividual,
  useEditIndividualData,
  useGetEditIndividualData,
  useGetMetaRegistrationPayload,
} from "@/hooks/query/useIndividualQ";
import ServerRequestLoader from "@/components/loaders/server-request-loader";
import { AxiosError } from "axios";
import ErrorPage from "@/components/error-page";

export default function IndividualForm({edit}:{edit:boolean}) {
  const { data, isPending } = useGetMetaRegistrationPayload();
  const {data:defaultData,isPending:isDefaultDataPending,isError:isEditDetailsError} =  useGetEditIndividualData(edit)
  const { register,  handleSubmit,control,formState: { errors,isDirty },reset,} = useForm<IRegisterIndividualForm>({
    resolver: zodResolver(RegisterIndividualSchema),
    defaultValues:  {  gender: "male" } ,
  });
  useEffect(() => {
  if (edit && defaultData?.payload) {
    reset({...defaultData.payload,"email":defaultData.payload.email??"","cnic":defaultData.payload.cnic||""});
  }
}, [edit, defaultData]);

  const {  mutate, isPending: isCreating,isError,error,} = useCreateNewIndividual(reset);
  const {  mutate:Edit, isPending: isEditing,isError:isEditError,error:editError,} = useEditIndividualData();

  const Error = error as AxiosError<{ message: string }>;
  const EditError = editError as AxiosError<{ message: string }>
  
  const onSubmit = (data: IRegisterIndividualForm) => {
    if (edit){
      Edit(data)
    }
    else {
      mutate(data);
    }
  };
  if (edit ){
    if(isDefaultDataPending){
      return <Card className="w-full flex items-center justify-center "><ServerRequestLoader/></Card>
    }
    if(isEditDetailsError){
      return <ErrorPage message="It looks like you've entered an incorrect individual ID. Please check your ID and try again."/>
    }
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center  px-4">
      <Card className="w-full ">
        <CardHeader>
          <CardTitle className="text-2xl"> {edit ? "Edit Individual details" :  "Individual Registration" } </CardTitle>
          <CardDescription>
            {edit ? "Edit the feilds you want to be changed, keep the remaning fields unchanged." :  "Fill out the form below to register a new individual."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
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
                <Label htmlFor="cnic">CNIC/ID</Label>
                <Input
                  id="cnic"
                  type="number"
                  {...register("cnic")}
                  placeholder="4xxxxxxxxxxxxx"
                  aria-invalid={!!errors.cnic}
                  aria-describedby="phone-error"
                />
                
                {errors.cnic && (
                  <p id="cnic-error" className="text-sm text-red-500">
                    {errors.cnic.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field, fieldState }) => {
                    return (
                      <>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            id="gender"
                            aria-describedby="gender-error"
                            className="w-full"
                          >
                            <SelectValue placeholder="Gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {fieldState.error && (
                          <p
                            id="contact-error"
                            className="text-sm text-red-500"
                          >
                            {fieldState.error.message}
                          </p>
                        )}
                      </>
                    );
                  }}
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
                  {isPending && <ServerRequestLoader size={14} />}
                </div>

                <Controller
                  name="group"
                  control={control}
                  render={({ field, fieldState }) => {
                    return (
                      <>
                        <Select
                          disabled={edit}
                          value={field.value ?? ""}
                          onValueChange={(val)=>val&&field.onChange(val)}
                        >
                          <SelectTrigger
                            id="className"
                            aria-describedby="className-error"
                            className="relative w-full"
                          >
                            <SelectValue placeholder="Select current group" />
                          </SelectTrigger>
                          <SelectContent>
                             {  data?.payload.groups.map((e) => (
                              <SelectItem value={e.id} key={e.id}>
                                {e.name}
                              </SelectItem> 
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.error && (
                          <p
                            id="className-error"
                            className="text-sm text-red-500"
                          >
                            {fieldState.error.message}
                          </p>
                        )}
                      </>
                    );
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfAdmission">Date of Admission *</Label>
                <Input
                  type="date"
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

            {!edit&&isError ? (
              <div className="mt-1 text-sm text-destructive">
                <p>{Error.response?.data.message || "Registration has failed"}</p>
              </div>
            ) : null}

            {edit&&isEditError ? (
              <div className="mt-1 text-sm text-destructive">
                <p>{EditError.response?.data.message || "Failed to edit the details"}</p>
              </div>
            ) : null}

            <CardFooter className="flex justify-end gap-2 p-0 ">
              <Button
                type="button"
                variant={"secondary"}
                onClick={() => edit?reset(defaultData?.payload) :reset()}
              >
                Reset
              </Button>
              <Button type="submit" disabled={isCreating||(edit&&!isDirty)} >
                {isCreating ? <ServerRequestLoader /> :
                edit ? " Save " : "Create" }
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
