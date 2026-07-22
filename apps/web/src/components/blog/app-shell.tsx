"use client";

import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";
import { ThemeToggle } from "@acme/ui/theme";
import {
  Bell,
  BookOpenText,
  FileText,
  LayoutDashboard,
  Menu,
  PenLine,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { AuthStatus } from "~/auth/status";

const navigation = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/posts/", icon: FileText, label: "Posts" },
  { href: "/editor/", icon: PenLine, label: "Editor" },
  { href: "/users/", icon: Users, label: "Users" },
  { href: "/admin/", icon: ShieldCheck, label: "Administration" },
] as const;

function Sidebar(props: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <Link
        className="flex h-16 items-center gap-3 border-b px-5"
        href="/"
        onClick={props.onNavigate}
      >
        <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
          <BookOpenText aria-hidden="true" className="size-4" />
        </span>
        <div>
          <p className="text-sm font-semibold">Northstar</p>
          <p className="text-muted-foreground text-xs">Editorial studio</p>
        </div>
      </Link>

      <nav aria-label="Primary" className="flex-1 space-y-1 px-3 py-5">
        <p className="text-muted-foreground mb-2 px-3 text-xs font-semibold uppercase">
          Workspace
        </p>
        {navigation.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href.replace(/\/$/, ""));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={props.onNavigate}
              className={cn(
                "text-muted-foreground hover:bg-muted hover:text-foreground flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium",
                active && "bg-muted text-foreground",
              )}
            >
              <Icon aria-hidden="true" className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-3">
        <Link
          href="/admin/"
          onClick={props.onNavigate}
          className="hover:bg-muted flex items-center gap-3 rounded-md px-3 py-2"
        >
          <span className="bg-foreground text-background flex size-8 items-center justify-center rounded-full text-xs font-semibold">
            MC
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium">
              Maya Chen
            </span>
            <span className="text-muted-foreground block truncate text-xs">
              Administrator
            </span>
          </span>
          <Settings
            aria-hidden="true"
            className="text-muted-foreground size-4"
          />
        </Link>
      </div>
    </div>
  );
}

export function AppShell(props: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname.startsWith("/auth/")) return props.children;

  return (
    <div className="bg-muted/30 min-h-screen">
      <aside className="bg-background fixed inset-y-0 left-0 z-30 hidden w-64 border-r lg:block">
        <Sidebar />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="bg-background relative h-full w-72 border-r shadow-xl">
            <Button
              aria-label="Close navigation"
              className="absolute top-4 right-3 z-10"
              onClick={() => setMobileOpen(false)}
              size="icon"
              variant="ghost"
            >
              <X aria-hidden="true" />
            </Button>
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="bg-background/95 sticky top-0 z-20 flex h-16 items-center border-b px-4 backdrop-blur sm:px-6">
          <Button
            aria-label="Open navigation"
            className="mr-2 lg:hidden"
            onClick={() => setMobileOpen(true)}
            size="icon"
            variant="ghost"
          >
            <Menu aria-hidden="true" />
          </Button>

          <button
            type="button"
            className="text-muted-foreground hover:bg-muted hidden h-9 min-w-64 items-center gap-2 rounded-md border px-3 text-left text-sm md:flex"
          >
            <Search aria-hidden="true" className="size-4" />
            Search workspace
            <span className="ml-auto text-xs">Ctrl K</span>
          </button>

          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
            <Button aria-label="Notifications" size="icon" variant="ghost">
              <Bell aria-hidden="true" />
            </Button>
            <span className="mx-2 hidden h-6 w-px bg-border sm:block" />
            <AuthStatus compact />
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {props.children}
        </main>
      </div>
    </div>
  );
}
