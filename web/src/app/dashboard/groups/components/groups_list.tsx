"use client"
import { Card, CardContent, CardFooter } from "@/shadcn/components/ui/card";
import { Badge } from "@/shadcn/components/ui/badge";
import { Button } from "@/shadcn/components/ui/button";
import { Edit, MoreHorizontal } from "lucide-react";
import {  DropdownMenu, DropdownMenuContent, DropdownMenuItem,DropdownMenuTrigger,} from "@/shadcn/components/ui/dropdown-menu";
import { useAtomValue } from "jotai";
import { GroupsListingAtom } from "@/lib/atoms/groups.atom";
import { useGetGroups } from "@/hooks/query/useGroupQ";
import { useEffect } from "react";
import ServerRequestLoader from "@/components/loaders/server-request-loader";
import clsx from "clsx";
import EditGroupDialog from "./edit_group_dialog";

function GroupsList() {
  const { mutate, isPending } = useGetGroups();
  const state = useAtomValue(GroupsListingAtom);
  useEffect(() => {
    mutate({ count: 0, input: "" });
  }, []);

  if (isPending|| !state.total) {
    return (
      <Card>
        <CardContent>
          <div className="flex items-center justify-center">
            {isPending ? <ServerRequestLoader /> :
            !state.total  && <p>No Group is found </p>
            }
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent>
        <div className="space-y-4">
          {(state.groups).map((c,i) => (
            <div
              key={c.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex gap-2 items-center">
                <Badge variant={"outline"} className="!rounded-md">{i+1} </Badge>
              <h3 className="text-xl font-bold">{c.name}</h3>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="secondary">{101} students</Badge>
                <Badge variant="default" className={clsx(c.is_active?"bg-green-800 text-white":"bg-orange-900")}>{c.is_active?"Active":"Not Active"}</Badge>
                <div className="flex gap-1">
                <EditGroupDialog id={c.id} prev_name={c.name} >
                  <Button size="sm" variant="ghost">
                    <Edit className="h-4 w-4" />
                  </Button>

                </EditGroupDialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      
                      <DropdownMenuItem>View Details</DropdownMenuItem> 

                      <DropdownMenuItem className="text-destructive">
                        Deactivate
                      </DropdownMenuItem>

                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
        <GroupFetchMoreButton count={state.count} total={state.total} mutate={mutate} isPending={isPending} />
         
      </CardContent>
    </Card>
  );
}

function GroupFetchMoreButton({count,total,mutate,isPending}:{count:number,total:number,isPending:boolean,mutate:(payload:{count:number,input?:string})=>void}){
  const limit = Number(process.env["NEXT_PUBLIC_GROUPS_PER_PAGE"]) || 15
  const fetchMore = ()=>{
    mutate({count:count+1})

  }
  return <CardFooter className="justify-end mt-4 mx-0 px-0">
          <Button onClick={fetchMore} variant={"outline"} disabled={isPending || limit*(count+1) >= total}> Load More </Button>
         </CardFooter>
}



export default GroupsList;
