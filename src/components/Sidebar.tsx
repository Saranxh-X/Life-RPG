"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sword,
  Scroll,
  ShoppingBag,
  LogOut,
  Package,
} from "lucide-react";
import { logout } from "@/app/actions/auth";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Quests", href: "/dashboard#quests", icon: Scroll },
  { name: "Character", href: "/dashboard#character", icon: Sword },
  { name: "Inventory", href: "/dashboard/inventory", icon: Package },
  { name: "Rewards", href: "/dashboard/shop", icon: ShoppingBag },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-card border-r border-border h-screen sticky top-0 flex flex-col hidden md:flex">
      <div className="h-20 flex items-center px-6 border-b border-border">
        <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg border border-primary/40 bg-primary/10">
          <Sword className="h-5 w-5 text-primary" />
        </div>
        <div>
          <span className="block font-bold text-xl text-foreground tracking-tight">
            Life RPG
          </span>
          <span className="block text-[9px] uppercase tracking-[.3em] text-muted-foreground">
            Quest journal
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full text-left text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </form>
      </div>
    </aside>
  );
}
