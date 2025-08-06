"use client"

import React, { ReactNode } from 'react'
import { useState } from "react"
import { Button } from "@/shadcn/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/components/ui/dialog"
import { Label } from "@/shadcn/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/shadcn/components/ui/command"
import { Checkbox } from "@/shadcn/components/ui/checkbox"
import { Badge } from "@/shadcn/components/ui/badge"
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { cn } from "@/lib/utils"
import { useGetGroupPairs } from '@/hooks/query/useGroupQ'
import ServerRequestLoader from '@/components/loaders/server-request-loader'
import { useGetAttModuleGroupUsers } from '@/hooks/query/useAttModuleQ'

const groups = [
  { id: "admin", name: "Administrators" },
  { id: "editor", name: "Editors" },
  { id: "viewer", name: "Viewers" },
  { id: "contributor", name: "Contributors" },
]

const users = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com" },
  { id: "2", name: "Bob Smith", email: "bob@example.com" },
  { id: "3", name: "Carol Davis", email: "carol@example.com" },
  { id: "4", name: "David Wilson", email: "david@example.com" },
  { id: "5", name: "Emma Brown", email: "emma@example.com" },
  { id: "6", name: "Frank Miller", email: "frank@example.com" },
  { id: "7", name: "Grace Lee", email: "grace@example.com" },
  { id: "8", name: "Henry Taylor", email: "henry@example.com" },
]
function AddGroupDialog({children}:{children:ReactNode}) {
  const {data,isPending} = useGetGroupPairs()
  const {data:group_users_list} = useGetAttModuleGroupUsers()
  const filled_groups = group_users_list?.payload.map(e=>e.group)
  const available_groups = data?.payload.filter(e=>!filled_groups?.includes(e.id))
  
  const [open, setOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [usersOpen, setUsersOpen] = useState(false)

  const handleUserToggle = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const removeUser = (userId: string) => {
    setSelectedUsers(prev => prev.filter(id => id !== userId))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setOpen(false)
  }

  const selectedUserNames = users
    .filter(user => selectedUsers.includes(user.id))
    .map(user => user.name)

  return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Group</DialogTitle>
            <DialogDescription>
              Select a group and assign users to it. You can select multiple users.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="group">Available Group</Label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  {
                    isPending ? <ServerRequestLoader/>:
                    available_groups?.length == 0 ?
                    <p className='text-sm text-muted-foreground'>
                        0 Group found 
                    </p> :
                  available_groups?.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
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
                        <span className="text-muted-foreground">Select users...</span>
                      ) : (
                        selectedUserNames.map((name) => (
                          <Badge key={name} variant="secondary" className="text-xs">
                            {name}
                            <button
                              type="button"
                              className="ml-1 hover:bg-muted rounded-full"
                              onClick={(e) => {
                                e.stopPropagation()
                                const user = users.find(u => u.name === name)
                                if (user) removeUser(user.id)
                              }}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))
                      )}
                    </div>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search users..." />
                    <CommandList className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      <CommandEmpty>No users found.</CommandEmpty>
                      <CommandGroup>
                        {users.map((user) => (
                          <CommandItem
                            key={user.id}
                            onSelect={() => {}} 
                            className="flex items-center space-x-2 cursor-pointer hover:bg-accent"
                            onClick={() => handleUserToggle(user.id)}
                          >
                            <Checkbox
                              checked={selectedUsers.includes(user.id)}
                              onCheckedChange={() => handleUserToggle(user.id)}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{user.name}</div>
                              <div className="text-sm text-muted-foreground truncate">{user.email}</div>
                            </div>
                            <Check
                              className={cn(
                                "h-4 w-4 flex-shrink-0",
                                selectedUsers.includes(user.id) ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {selectedUsers.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!selectedGroup || selectedUsers.length === 0}>
                Assign Users
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  )
}

export default AddGroupDialog