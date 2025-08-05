"use client"
import { Card, CardContent, CardFooter } from "@/shadcn/components/ui/card";
import { Badge } from "@/shadcn/components/ui/badge";
import { Button } from "@/shadcn/components/ui/button";
import { Edit, MoreHorizontal, Users } from "lucide-react";
import {  DropdownMenu, DropdownMenuContent, DropdownMenuItem,DropdownMenuTrigger,} from "@/shadcn/components/ui/dropdown-menu";
import { useAtomValue } from "jotai";
import { GroupsListingAtom } from "@/lib/atoms/groups.atom";
import { useFetchGroupHistory, useGetGroups } from "@/hooks/query/useGroupQ";
import { useEffect, useState } from "react";
import ServerRequestLoader from "@/components/loaders/server-request-loader";
import clsx from "clsx";
import EditGroupDialog from "./edit_group_dialog";
import { IgroupList } from "@/types/group";
import GroupHistoryDialog from "./group_history_dailog";
import Link from "next/link";

function GroupsList() {
  const [OpenHistory, setOpenHistory] = useState(false)
  const {mutate:fetchHistory,isPending:isLoading,data,isError} = useFetchGroupHistory()
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
  function RequestFetchHistory(id:string,){
    setOpenHistory(true)
    fetchHistory(id)
  }
  
  return (
    <Card>
      <CardContent>
        <div className="space-y-4">
          {(state.groups).map((c,i) => ( <EachGroup c={c} key={c.id} index={i} RequestFetchHistory={RequestFetchHistory} />))}
        </div>
        <GroupFetchMoreButton count={state.count} total={state.total} mutate={mutate} isPending={isPending}  />
         <GroupHistoryDialog  history={data?.payload?.history||[]} isError={isError} isPending={isLoading} open={OpenHistory} setOpen={setOpenHistory}/>
      </CardContent>
    </Card>
  );
}

function GroupFetchMoreButton({count,total,mutate,isPending,}:{count:number,total:number,isPending:boolean,mutate:(payload:{count:number,input?:string})=>void,

}){
  const limit = Number(process.env["NEXT_PUBLIC_GROUPS_PER_PAGE"]) || 15
  const fetchMore = ()=>{
    mutate({count:count+1})

  }
  return <CardFooter className="justify-end mt-4 mx-0 px-0">
          <Button onClick={fetchMore} variant={"outline"} disabled={isPending || limit*(count+1) >= total}> Load More </Button>
         </CardFooter>
}


function EachGroup({c,index,RequestFetchHistory}:{c:IgroupList,index:number,RequestFetchHistory(id: string): void}){

   return ( <div
              key={c.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex gap-2 items-center">
                <Badge variant={"outline"} className="!rounded-md">{index+1} </Badge>
              <h3 className="text-xl font-bold">{c.name}</h3>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="secondary">{c.individuals} individuals</Badge>
                <Badge variant="default" className={clsx(c.is_active?"bg-green-800 text-white":"bg-orange-900")}>{c.is_active?"Active":"Not Active"}</Badge>
                <div className="flex gap-1">
                  <Link href={`groups/${c.id}`}>
                  <Button size="sm" variant="ghost">
                    <Users className="h-4 w-4" />
                  </Button>
                  </Link>
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
                      
                      <DropdownMenuItem onClick={()=>RequestFetchHistory(c.id)}>View History details</DropdownMenuItem> 

                      <DropdownMenuItem className="text-destructive">
                        Deactivate
                      </DropdownMenuItem>

                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>)
}



export default GroupsList;
