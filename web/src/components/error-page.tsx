"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/shadcn/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/components/ui/card"

export default function ErrorPage({message}:{message:string}) {
  const router = useRouter()

  return (
    <div className="flex w-full items-center justify-center  px-4 py-12">
      <Card className=" w-lg max-md:w-full text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Not found</CardTitle>
          <CardDescription>
            {message}

          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
          <Link href="/dashboard" passHref>
            <Button className="w-full">Go Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
