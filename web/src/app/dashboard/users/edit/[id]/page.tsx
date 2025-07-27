"use client";
import React from "react";
import { useFetchBasicDetailsUser } from "@/hooks/query/useUserQ";
import ServerRequestLoader from "@/components/loaders/server-request-loader";
import { Card, CardContent } from "@/shadcn/components/ui/card";
import UserForm from "../../components/user-form";

export default function EditUserDetailsPage() {
  const { data, isPending, isError, error } = useFetchBasicDetailsUser();
  if (isPending) { 
       return (
      <div className="h-full flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
            <CardContent className="flex flex-col gap-4 items-center justify-center">
                <ServerRequestLoader size={40} stroke={5}/>
                <b className="text-foreground">Fetching Users details</b>
            </CardContent>
        </Card>
      </div>
    );
  }
    if (isError) {
        return (
        <div className="h-full flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
            <CardContent className="flex flex-col gap-4 items-center justify-center">
                <b className="text-red-500">Error: {error.message}</b>
            </CardContent>
            </Card>
        </div>
        );
    }
        
  return <UserForm edit={true} defaultValues={data.payload} />;
}
