"use client";

import ServerRequestLoader from "@/components/loaders/server-request-loader";
import { Button } from "@/shadcn/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shadcn/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shadcn/components/ui/dialog";
import { IgroupHistory } from "@/types/group";
import { SetStateAction } from "jotai";
import moment from "moment";
import { Dispatch } from "react";
export default function GroupHistoryDialog({
  history,
  isPending,
  isError ,
  open ,setOpen
}: {
  history: IgroupHistory;
  isPending: boolean;
  isError:boolean;
  open:boolean ;
  setOpen : Dispatch<SetStateAction<boolean>>
}) {
    
  return (
    <Dialog open={open} onOpenChange={(o)=>setOpen(o)}>
    
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Event History</DialogTitle>
          <DialogDescription>
            A chronological list of activation and deactivation events.
          </DialogDescription>
        </DialogHeader>
        <Card className="border-none shadow-none">
          {isPending ? (
            <div className="flex items-center justify-center">
              <ServerRequestLoader />
            </div>
          ) : isError? 
            <div className="flex items-center justify-center">
                <p className="font-medium text-lg text-destructive"> History is not available</p>
</div>
          : (
            <>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recent Events</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center justify-between rounded-md bg-muted/50 p-3">
                  <div className="font-medium">Created on </div>
                  <div className="text-sm text-muted-foreground">
                    {moment(history?.created_at).calendar()}
                  </div>
                </div>

                {history?.history?.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-md bg-muted/50 p-3"
                  >
                    <div className="font-medium">{event.is_active}</div>
                    <div className="text-sm text-muted-foreground">
                      {moment(event.updated_at).calendar()}
                    </div>
                  </div>
                ))}
              </CardContent>{" "}
            </>
          )}
        </Card>
      </DialogContent>
    </Dialog>
  );
}
