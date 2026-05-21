import { Link, useRouterState } from "@tanstack/react-router";
import { BRAND } from "@/config/brand";
import { NAV_ITEMS } from "./nav-items";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-sidebar lg:flex lg:flex-col">
      <div className="flex items-center gap-2 px-5 py-5">
        <img src={BRAND.logoIcon} alt="" className="h-9 w-9 rounded-lg object-contain" />
        <div className="leading-tight">
          <p className="text-base font-semibold tracking-tight text-foreground">{BRAND.name}</p>
          <p className="text-[11px] text-muted-foreground">{BRAND.tagline}</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-6">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-foreground/80 hover:bg-sidebar-accent hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
        v0.1 · MVP
      </div>
    </aside>
  );
}
