"use client";
import React, { useEffect } from "react";
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
  Ban,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shadcn/components/ui/card";
import { Badge } from "@/shadcn/components/ui/badge";
import { useAtom, useAtomValue } from "jotai";
import { UsersListingAtom } from "@/lib/atoms/users.atom";
import { Button } from "@/shadcn/components/ui/button";
import ServerRequestLoader from "@/components/loaders/server-request-loader";
import clsx from "clsx";
import { useFetchAllUsers } from "@/hooks/query/useUserQ";
import BlockUserAction from "./block_user_action";
function UsersTable() {
  const { isPending, mutate, status } = useFetchAllUsers();
  const state = useAtomValue(UsersListingAtom);
  useEffect(() => {
    mutate({ count: 0, ...state.filters });
  }, []);

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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                <div className="flex items-center justify-center">
                  <ServerRequestLoader />
                </div>
              ) : (
                <Users />
              )}
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

  if (Object.values(state.users).length == 0) {
    return (
      <TableRow>
        <TableCell colSpan={5} className="text-center py-6">
          <div className="text-muted-foreground">No users found</div>
        </TableCell>
      </TableRow>
    );
  }

  return state.users[state.count].map((user) => (
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
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem className="flex items-center justify-center pl-0">
              <Edit className="w-4 h-4 " />
              Edit user
            </DropdownMenuCheckboxItem>

            <BlockUserAction isblocked={user.is_blocked}/>
         
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  ));
}

function Pagination() {
  const [state, setState] = useAtom(UsersListingAtom);
  const { isPending, mutate } = useFetchAllUsers();
  const usersPerPage = Number(process.env["NEXT_PUBLIC_USERS_PER_PAGE"]);
  const total_count = Math.ceil(state.total / usersPerPage);
  function FetchNext() {
    if (state.count + 1 < total_count) {
      const payload = { count: state.count + 1, ...state.filters };
      setState({ ...state, count: state.count + 1 });
      if (state?.users?.[state.count + 1].length != 0) {
        return;
      } else {
        mutate(payload);
      }
    }
  }
  function FetchPrevious() {
    if (state.count + 1 > 1) {
      const payload = { count: state.count - 1, ...state.filters };
      setState({ ...state, count: state.count - 1 });
      if (state?.users?.[state.count - 1].length != 0) {
      } else {
        mutate(payload);
      }
    }
  }

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-muted-foreground">
        Page {state.count + 1} of {total_count}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={FetchPrevious}
          disabled={state.count + 1 <= 1}
        >
          {isPending ? (
            <ServerRequestLoader />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={FetchNext}
          disabled={state.count + 1 >= total_count}
        >
          Next
          {isPending ? (
            <ServerRequestLoader />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
