'use client'

import * as React from "react"
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/shadcn/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/shadcn/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shadcn/components/ui/popover"
import { Badge } from "@/shadcn/components/ui/badge"
import { useGetGroupPairs } from "@/hooks/query/useGroupQ"



interface MultiSelectGroupsProps {
  selectedGroups?: string[] // Make it optional to allow default value
  onGroupsChange: (groups: string[]) => void
}

export function MultiSelectGroups({ selectedGroups = [], onGroupsChange}: MultiSelectGroupsProps) {
  const {data,isPending}  = useGetGroupPairs()

  const [open, setOpen] = React.useState(false)

  const handleSelect = (currentValue: string,all?:boolean) => {
    if (all){
      onGroupsChange(groups?.map(e=>e.id)||[])
      return;
    }

    const isSelected = selectedGroups.includes(currentValue)
    if (isSelected) {
      onGroupsChange(selectedGroups.filter((group) => group !== currentValue))
    } else {
      onGroupsChange([...selectedGroups, currentValue])
    }
  }
  const groups = data?.payload
  return (
    <Popover open={open} onOpenChange={setOpen} >
      <PopoverTrigger asChild disabled={isPending}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-[40px]"
        >
          <div className="flex flex-wrap gap-1">
            {selectedGroups.length === 0 ? (
              <span className="text-muted-foreground">Select groups...</span>
            ) : (
              selectedGroups.map((groupValue) => {
                const group = groups?.find((g) => g.id === groupValue)
                return group ? <Badge key={group.id}>{group.name}</Badge> : null
              })
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="Search groups..." />
          <CommandEmpty>
          {
            isPending ? "Fetching Groups" :"No group found"
          }

          </CommandEmpty>
          <CommandGroup>
            {groups?.concat({"id":"all",name:"Select All Groups"})?.map((group) => {
                if (group.id == "all"){
                return <CommandItem
                key={group.id}
                onSelect={() => handleSelect(group.id,true)}
                >
                     <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  selectedGroups.includes(group.id) ? "opacity-100" : "opacity-0"
                  )}
                />
                {group.name}
                </CommandItem>

                }

                return <CommandItem
                key={group.id}
                onSelect={() => handleSelect(group.id)}
                >
                <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  selectedGroups.includes(group.id) ? "opacity-100" : "opacity-0"
                  )}
                />
                {group.name}
                </CommandItem>
              }
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
