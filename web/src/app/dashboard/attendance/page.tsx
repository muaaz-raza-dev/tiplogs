"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/components/ui/card"
import { Badge } from "@/shadcn/components/ui/badge"
import { Button } from "@/shadcn/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useGetAttModulesUserSpecific } from "@/hooks/query/useAttQ"
import Link from "next/link"
import ServerRequestLoader from "@/components/loaders/server-request-loader"

export default function Page() {
  const {data,isPending} = useGetAttModulesUserSpecific()

  return (
    <main className="min-h-dvh px-4 py-4">
      <section className="w-full">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Modules</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Go to attendance module to view attendance details. .
          </p>
        </header>

          {
            isPending ? <div className="w-full my-6 flex items-center justify-center">
              <ServerRequestLoader/>
            </div>:
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {
            data?.payload.modules.map((e)=>(
              <Card className="h-full transition-all gap-2 " key={e.id}>
              <CardHeader className="">
                <CardTitle className="text-lg">{e.name} </CardTitle>
                <p className="text-sm text-muted-foreground">{e.description||"no description"}</p>
              </CardHeader>
              <CardContent className="flex-col">
                <div className="flex flex-col gap-4">
                <Badge className="bg-amber-100  px-4 text-base">
                  {e.frequency}
                </Badge>
             <Link href={`/dashboard/attendance/groups/module?module=${e.id}`} className="w-full"> <Button className="w-full" > Groups <ArrowRight/> </Button> </Link>
                </div>
              </CardContent>
            </Card>
            ))
          }
        </div>
          }
      </section>
    </main>
  )
}
