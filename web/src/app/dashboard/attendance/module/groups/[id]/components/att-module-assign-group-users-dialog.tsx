"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import { Button } from "@/shadcn/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/components/ui/dialog";
import { Label } from "@/shadcn/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shadcn/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shadcn/components/ui/command";
import { Badge } from "@/shadcn/components/ui/badge";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetGroupPairs } from "@/hooks/query/useGroupQ";
import ServerRequestLoader from "@/components/loaders/server-request-loader";
import { useGetAttModuleGroupUsers, useUpdateGroupUserAttendanceModule } from "@/hooks/query/useAttModuleQ";
import { useGetUserPairs } from "@/hooks/query/useUserQ";
import { useAtom } from "jotai";
import { AttModuleGroupUserAssignmentAtom } from "@/lib/atoms/att-module.atom";

function AssignGroupUsersDialog() {
  const {mutate:update,isPending:isUpdating} = useUpdateGroupUserAttendanceModule(onSuccess)
  const [atomState, setAtomState] = useAtom(AttModuleGroupUserAssignmentAtom);
  const { data, isPending: isFetchingGroupPairs } = useGetGroupPairs();
  const { data: group_users_list, isPending: isFetchingGroupUsersList } = useGetAttModuleGroupUsers();
  const { data: fetched_users, isPending: isFetchingUserPairs } = useGetUserPairs();
  const group_to_users = group_users_list?.payload.groups_to_users
  
  const users = fetched_users?.payload.list;
  const filled_groups = group_to_users?.map((e) => e.group); 
  const available_groups = data?.payload.filter((e) => !filled_groups?.includes(e.id));

  const [open, setOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(atomState.selected_group ?? "");
  const [selectedUsers, setSelectedUsers] = useState<string[]>(atomState.selected_users ?? []);
  const [usersOpen, setUsersOpen] = useState(false);


  useEffect(() => {
    setOpen(atomState.open_dialog);
    setSelectedGroup(atomState.selected_group);
    setSelectedUsers(atomState.selected_users);
  }, [
    atomState.selected_group,
    atomState.open_dialog,
  ]);
  function onSuccess(){
    setOpen(false);
    setAtomState({ ...atomState, open_dialog: false });
  }
  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id != userId)
        : [...prev, userId]
    );
  };

  const removeUser = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((id) => id !== userId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    update({group:selectedGroup,users:selectedUsers})
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!isUpdating){
          setOpen(o);
          setAtomState({ ...atomState, open_dialog: o });
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Users to Group</DialogTitle>
          <DialogDescription>
            Select a group and assign users to it. You can select multiple
            users.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="group">Group </Label>
            <Select
              disabled={
                isFetchingGroupUsersList ||
                isFetchingGroupPairs ||
                atomState.group_selection_disabled
              }
              value={selectedGroup}
              onValueChange={setSelectedGroup}
            >
              <SelectTrigger className="w-full !font-medium">
                <SelectValue
                  placeholder="Select a group"
                  className="font-medium"
                />
              </SelectTrigger>
              <SelectContent>
                {!atomState.group_selection_disabled && available_groups?.length == 0 ? (
                  <p className="text-sm text-muted-foreground">0 Group found</p>
                ) : (
                  isFetchingGroupPairs ? 
                  <ServerRequestLoader/> :
                  (atomState.group_selection_disabled ? data?.payload : available_groups)?.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="users">Users</Label>
            <Popover open={usersOpen} onOpenChange={setUsersOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={usersOpen}
                  className="w-full justify-between h-auto min-h-10 px-3 py-2"
                >
                  <div className="flex flex-wrap gap-1">
                    {selectedUsers.length === 0 ? (
                      <span className="text-muted-foreground">
                        Select users...
                      </span>
                    ) : (
                      selectedUsers.map((id) => (
                        <Badge key={id} variant="secondary" className="text-xs">
                          {fetched_users?.payload.pairs[id]}
                          <div
                            className="ml-1 hover:bg-muted rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              const user = users?.find((u) => u.id == id);
                              if (user) removeUser(user.id);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </div>
                        </Badge>
                      ))
                    )}
                  </div>
                  {isFetchingUserPairs ? (
                    <ServerRequestLoader />
                  ) : (
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search users..." />
                  <CommandList className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <CommandEmpty>No users found.</CommandEmpty>
                    <CommandGroup>
                      {users?.map((user) => (
                        <CommandItem
                          key={user.id}
                          onSelect={() => handleUserToggle(user.id)}
                          className="flex items-center font-medium tracking-wide space-x-2 cursor-pointer hover:bg-accent"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4 text-white hover:black",
                              selectedUsers.includes(user.id)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {user.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {selectedUsers.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {selectedUsers.length} user
                {selectedUsers.length !== 1 ? "s" : ""} selected
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
            disabled={isUpdating}
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={ isUpdating || (!atomState.group_selection_disabled && selectedGroup == "") || 
                (selectedUsers.length == atomState.selected_users.length
                  ? selectedUsers.every((e) => atomState.selected_users.includes(e))
                  : false)
              }
            >
              {
                isUpdating ? <ServerRequestLoader/> : "Assign Users"
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AssignGroupUsersDialog;
