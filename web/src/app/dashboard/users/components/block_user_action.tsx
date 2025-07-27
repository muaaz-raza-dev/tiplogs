import { useToggleUserBLockQ } from "@/hooks/query/useUserQ";
import { DropdownMenuCheckboxItem } from "@/shadcn/components/ui/dropdown-menu";
import clsx from "clsx";
import { Ban } from "lucide-react";
import React from "react";

function BlockUserAction({ isblocked ,id}: { isblocked: boolean,id:string }) {
  const {mutate,isPending} = useToggleUserBLockQ()
    
  return (
    <DropdownMenuCheckboxItem className={clsx("flex items-center justify-start pl-2 cursor-pointer",!isblocked?"text-destructive":"text-green-800")} onClick={()=>mutate(id)}>
      <Ban className="w-4 h-4 " /> 
      {  isblocked ? "Unblock " : "Block "  }
       user
    </DropdownMenuCheckboxItem>
  );
}

export default BlockUserAction;
