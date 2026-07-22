"use client";

import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";
import { toast } from "@acme/ui/toast";
import { MoreHorizontal, Search, UserPlus, X } from "lucide-react";
import { useMemo, useState } from "react";
import { blogUsers } from "~/lib/blog-data";
import { StatusBadge } from "./status-badge";

export function UserManagementView() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("All roles");
  const [inviteOpen, setInviteOpen] = useState(false);
  const users = useMemo(
    () =>
      blogUsers.filter(
        (user) =>
          (role === "All roles" || user.role === role) &&
          `${user.name} ${user.email}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [query, role],
  );

  return (
    <>
      <div className="bg-background overflow-hidden rounded-lg border">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center">
          <label className="relative flex-1" htmlFor="user-search">
            <span className="sr-only">Search users</span>
            <Search className="text-muted-foreground absolute top-2.5 left-3 size-4" />
            <Input
              className="pl-9"
              id="user-search"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search users"
              value={query}
            />
          </label>
          <select
            aria-label="Filter by role"
            className="bg-background h-9 rounded-md border px-3 text-sm"
            onChange={(event) => setRole(event.target.value)}
            value={role}
          >
            <option>All roles</option>
            <option>Administrator</option>
            <option>Editor</option>
            <option>Author</option>
          </select>
          <Button onClick={() => setInviteOpen(true)}>
            <UserPlus />
            Invite user
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-muted/60 text-muted-foreground text-xs uppercase">
              <tr>
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Posts</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="w-14">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user.email}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="bg-muted flex size-9 items-center justify-center rounded-full text-xs font-semibold">
                        {user.initials}
                      </span>
                      <span>
                        <span className="block font-medium">{user.name}</span>
                        <span className="text-muted-foreground text-xs">
                          {user.email}
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">{user.role}</td>
                  <td className="px-4 py-4">
                    <StatusBadge label={user.status} />
                  </td>
                  <td className="px-4 py-4">{user.posts}</td>
                  <td className="text-muted-foreground px-4 py-4">
                    {user.joined}
                  </td>
                  <td>
                    <Button
                      aria-label={`Actions for ${user.name}`}
                      size="icon"
                      variant="ghost"
                    >
                      <MoreHorizontal />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div
            aria-modal="true"
            className="bg-background w-full max-w-md rounded-lg border p-5 shadow-xl"
            role="dialog"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Invite a team member</h2>
              <Button
                aria-label="Close invite dialog"
                onClick={() => setInviteOpen(false)}
                size="icon"
                variant="ghost"
              >
                <X />
              </Button>
            </div>
            <div className="mt-5 space-y-4">
              <label
                className="block text-sm font-medium"
                htmlFor="invite-email"
              >
                Email address
                <Input
                  className="mt-2"
                  id="invite-email"
                  placeholder="name@example.com"
                  type="email"
                />
              </label>
              <label className="block text-sm font-medium">
                Role
                <select className="bg-background mt-2 h-9 w-full rounded-md border px-3">
                  <option>Author</option>
                  <option>Editor</option>
                  <option>Administrator</option>
                </select>
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button onClick={() => setInviteOpen(false)} variant="outline">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setInviteOpen(false);
                  toast.success("Invitation sent");
                }}
              >
                Send invitation
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
