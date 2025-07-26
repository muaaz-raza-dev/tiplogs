import { DropdownMenuCheckboxItem } from "@/shadcn/components/ui/dropdown-menu";
import clsx from "clsx";
import { Ban } from "lucide-react";
import React from "react";

function BlockUserAction({ isblocked }: { isblocked: boolean }) {
  return (
    <DropdownMenuCheckboxItem className={clsx("flex items-center justify-center pl-0",!isblocked?"text-destructive":"text-green-600")}>
      <Ban className="w-4 h-4 " />
      Block user
    </DropdownMenuCheckboxItem>
  );
}

export default BlockUserAction;
