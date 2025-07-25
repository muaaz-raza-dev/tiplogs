"use client";
import React from "react";
import moment from "moment";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/shadcn/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcn/components/ui/table";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shadcn/components/ui/card";
import { Badge } from "@/shadcn/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shadcn/components/ui/avatar";
import { useAtom, useAtomValue } from "jotai";
import { UsersListingAtom } from "@/lib/atoms/users.atom";
import { Button } from "@/shadcn/components/ui/button";
import ServerRequestLoader from "@/components/loaders/server-request-loader";
import { useGetAllUsers } from "@/hooks/query/useUserQ";
import clsx from "clsx";
function UsersTable() {
  const { isPending } = useGetAllUsers();

  if (isPending) {
    return <ServerRequestLoader />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <Users />
            </TableBody>
          </Table>
        </div>
        {/* Pagination */}
        <Pagination />
      </CardContent>
    </Card>
  );
}

export default UsersTable;

function Users() {
  const state = useAtomValue(UsersListingAtom);
  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "manager":
        return "bg-blue-100 text-blue-800";
      case "user":
        return "bg-gray-100 text-gray-800";
    }
  };
  if (state.users.length == 0) {
    return (
      <TableRow>
        <TableCell colSpan={5} className="text-center py-6">
          <div className="text-muted-foreground">No users found</div>
        </TableCell>
      </TableRow>
    );
  }
  return state.users.map((user) => (
    <TableRow key={user.id}>
      <TableCell>
        <div className="flex items-center space-x-3">
          <div>
            <div className="font-medium">{user.full_name}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="secondary" className={getRoleColor(user.role)}>
          {user.role}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge
          variant="secondary"
          className={clsx(
            user.is_blocked
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          )}
        >
          {user.is_blocked ? "Blocked" : "Active"}
        </Badge>
      </TableCell>

      <TableCell className="text-sm">
        {moment(user.created_at).calendar()}
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem className="flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem className="flex items-center">
              <Edit className="w-4 h-4 mr-2" />
              Edit User
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem className="flex items-center text-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete User
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  ));
}

function Pagination() {
  const [state,setState] = useAtom(UsersListingAtom);
  const { isPending, refetch } = useGetAllUsers();
  const usersPerPage =  Number(process.env["NEXT_PUBLIC_USERS_PER_PAGE"])
  const total_count = Math.ceil( state.total / usersPerPage )
  function FetchNext(){
    if(state.count < total_count){
      setState({...state,count:state.count+1})
      refetch()
    }
  }
  function FetchPrevious(){
  if(state.count > 1 ){
      setState({...state,count:state.count+1})
      refetch()
    }
  }

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-muted-foreground">
        Page {state.count} of {total_count}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={FetchPrevious}
          disabled={state.count  <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={FetchNext}
          disabled={ state.count >= total_count }
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
