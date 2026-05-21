import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { mockCompany } from "@/data";
import { useFontScale } from "@/contexts/font-scale";
import { ALargeSmall, Check, Menu, UserCircle2 } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { NAV_ITEMS } from "./nav-items";
import { BRAND } from "@/config/brand";
import { cn } from "@/lib/utils";

export function Topbar() {
  const { scale, setScale } = useFontScale();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const labels: Record<typeof scale, string> = {
    normal: "Normal",
    large: "Grande",
    xlarge: "Extra grande",
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-card/90 px-3 backdrop-blur lg:h-16 lg:px-6">
      {/* Mobile menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="ghost" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <div className="flex items-center gap-2 px-5 py-5">
            <img src={BRAND.logoIcon} alt="" className="h-9 w-9 rounded-lg object-contain" />
            <div className="leading-tight">
              <p className="text-base font-semibold">{BRAND.name}</p>
              <p className="text-[11px] text-muted-foreground">{BRAND.tagline}</p>
            </div>
          </div>
          <nav className="space-y-1 px-3">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.to || pathname.startsWith(item.to + "/");
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                    active ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-muted",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground lg:text-base">{mockCompany.name}</p>
        <p className="hidden text-xs text-muted-foreground lg:block">{mockCompany.region}</p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="outline" aria-label="Tamanho da fonte">
            <ALargeSmall className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Tamanho da fonte</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {(["normal", "large", "xlarge"] as const).map((s) => (
            <DropdownMenuItem key={s} onClick={() => setScale(s)} className="justify-between">
              {labels[s]}
              {scale === s && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button size="icon" variant="outline" aria-label="Perfil">
        <UserCircle2 className="h-5 w-5" />
      </Button>
    </header>
  );
}
