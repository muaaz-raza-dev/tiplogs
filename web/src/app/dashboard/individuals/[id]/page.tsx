"use client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shadcn/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shadcn/components/ui/card";
import { useGetIndividualDetailed } from "@/hooks/query/useIndividualQ";
import { Button } from "@/shadcn/components/ui/button";
import ServerRequestLoader from "@/components/loaders/server-request-loader";
import { DescriptionList } from "./components/description-list";
import { useMemo } from "react";
import PhotoComponent from "./components/photo-component";
import { Pen } from "lucide-react";
import Link from "next/link";
import moment from "moment";

export default function StudentDetailsPage() {
  const { data, isPending, isError, isSuccess } = useGetIndividualDetailed();
  const s = data?.payload;

  if (isPending) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <ServerRequestLoader />
      </div>
    );
  }
  if (s != undefined) {
    const { photo, id, ...p } = s.personal_details;

    return (
      <div className="w-full mx-auto py-8 px-4 md:px-6 lg:px-8">
        <Card className="w-full  mx-auto">
          <CardHeader className="flex justify-between border-b-2 items-center">
            <div className="flex flex-col sm:flex-row items-center gap-4 pb-6 ">
              <PhotoComponent photo={photo} name={p.full_name} />
              <div className="text-center sm:text-left">
                <CardTitle className="text-3xl font-bold">
                  {s.personal_details.full_name}
                </CardTitle>
                <p className="text-muted-foreground text-lg">
                  {s.personal_details.father_name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href={`/dashboard/individuals/edit/${id}`}>
                <Button
                  className="flex items-center gap-2 "
                  variant={"outline"}
                >
                  <Pen /> Edit{" "}
                </Button>
              </Link>
              <Button>Print ID card </Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 ">
            <div className="border-b-2 py-4">
              <h2 className="text-xl font-semibold mb-4">
                Personal Information
              </h2>
              <DescriptionList
                items={{
                  ...p,
                  "Date of birth": `${p["Date of birth"]}    ( ${
                    p?.["Date of birth"] && moment(p["Date of birth"]).fromNow()
                } )`,
                }}
              />
            </div>
            <div className="border-b-2 py-4">
              <h2 className="text-xl font-semibold mb-4 ">
                Acedmic Information
              </h2>
              <DescriptionList
                items={{
                  ...s.acedemic_details,
                  "Date of admission": `${s.acedemic_details["Date of admission"]}   ( ${
                    s.acedemic_details?.["Date of admission"] &&
                    moment(s.acedemic_details["Date of admission"]).fromNow()
                } ) `,
                }}
              />
            </div>
            <div className=" py-4">
              <h2 className="text-xl font-semibold mb-4">
                Account Information
              </h2>
              <DescriptionList items={{...s.account_details,"Created on":
                `${s.account_details["Created on"]}   ( ${
                    s.account_details?.["Created on"] &&
                    moment(s.account_details["Created on"]).fromNow()
              } )`

              }} />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}
