"use client"

import {
  Bell,
  Box,
  CircleUser,
  FileText,
  Home,
  ListCheck,
  LogOut,
  Plus,
  Users,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shadcn/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shadcn/components/ui/dropdown-menu"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Separator } from "@/shadcn/components/ui/separator"

// Navigation data
const data = {
  user: {
    name: "John Doe",
    email: "john@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  nav: [
   {
      title : "Individuals",
      navs :[
        {
        title:"Individuals" ,
        url:"/dashboard/individuals",
        exact:false,
        exact_exclude_urls:["/dashboard/individuals/new","/dashboard/individuals/requests"],
        icon : Users
      }
      ,{
        title:"Register new Individual" ,
        url:"/dashboard/individuals/new",
        exact:true,
        icon : Plus
      } ,
       {
        title:"Registeration requests" ,
        url:"/dashboard/individuals/requests",
        exact:true,
        icon : Bell
      }
    ]
    },

    {
      title : "Groups",
      navs :[
        {
      title: "Groups",
      url: "/dashboard/groups",
      exact:false,
      icon: Box ,
    }]
  },
   ,  {
      title : "Users",
      navs :[
        {
        title: "Users",
        url: "/dashboard/users",
        exact:false,
        exact_exclude_urls:["/dashboard/users/new"],
        icon: CircleUser,
      },
      {
        title: "Register user",
        url: "/dashboard/users/new",
        exact:true,
        icon: Plus,
      },
    ]} ,
    {
      title:"Attendance" ,
      navs:[
       {
        title: "Attendance Modules",
        url: "/dashboard/attendance/module",
        exact:false,
        exact_exclude_urls: ["/dashboard/attendance/module/new"],
        icon: ListCheck ,
      } ,
        {
        title: "Create Attendance Module",
        url: "/dashboard/attendance/module/new",
        exact:true,
        icon: Plus,
      } 
      ]
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  return (
    <Sidebar variant="sidebar" {...props}>
      <SidebarHeader>
        <SidebarMenu >
          <SidebarMenuItem >
          <SidebarMenuButton size={"lg"} asChild  >
            <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-secondary text-sidebar-secondary-foreground">
                  <FileText className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">TipLogs</span>
                  <span className="truncate text-xs">Log Management</span>
                </div>
            </Link>
            </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
              {data.nav.map((item) => (
        <SidebarGroup key={item?.title}>
          <SidebarGroupLabel>{item?.title}</SidebarGroupLabel>
            <SidebarMenu>
                {
                  item?.navs.map(e=>(
                    <SidebarMenuItem key={e.title}>
                  <SidebarMenuButton asChild isActive={
                    e.exact ? pathname == e.url :( pathname.includes(e.url) ?  (e.exact_exclude_urls ? ( !e.exact_exclude_urls.includes(pathname) ) : pathname.includes(e.url)):false)
                    }>
                    <Link href={e.url}>
                      <e.icon />
                      <span>{e.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                ))
              }
              </SidebarMenu>
            </SidebarGroup>
              ))}



        {/* Admin Section */}
    
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={data.user.avatar || "/placeholder.svg"} alt={data.user.name} />
                    <AvatarFallback className="rounded-lg">JD</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{data.user.name}</span>
                    <span className="truncate text-xs">{data.user.email}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuItem className="group">
                    <LogOut className="group-hover:text-secondary"/>
                  <span> Log out</span>
                  
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
