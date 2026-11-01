import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Menu, PanelLeftClose, PanelLeftOpen, Search, X, Github } from "lucide-react";
import { navGroups, allNavItems } from "@/content/nav";
import { cn } from "@/lib/utils";

function Logo({ compact }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" strokeWidth="1.6" strokeLinecap="round">
          <path d="M12 3 L7 11 H10 L6 17 H18 L14 11 H17 Z" stroke="var(--primary)" />
          <path d="M12 17 V21" stroke="var(--accent)" />
        </svg>
      </span>
      {!compact && (
        <span className="min-w-0">
          <span className="block text-[13px] font-semibold tracking-[0.12em]">RANDOM FOREST LAB</span>
          <span className="block truncate text-[11px] text-muted-foreground">Interactive Machine Learning Course</span>
        </span>
      )}
    </Link>
  );
}

function SidebarNav({ compact, onNavigate }: { compact?: boolean; onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
      {navGroups.map((g) => (
        <div key={g.label}>
          {!compact && <div className="mb-2 px-2 font-mono text-[10px] tracking-[0.14em] text-muted-foreground/70 uppercase">{g.label}</div>}
          <ul className="space-y-0.5">
            {g.items.map((it) => {
              const active = path === it.to || (it.to !== "/" && path.startsWith(it.to + "/"));
              return (
                <li key={it.to}>
                  <Link
                    to={it.to}
                    onClick={onNavigate}
                    title={compact ? it.title : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] transition-colors",
                      compact && "justify-center",
                      active ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                    )}
                  >
                    <it.icon className={cn("size-4 shrink-0", active && "text-primary")} />
                    {!compact && <span className="truncate">{it.title}</span>}
                    {!compact && active && <span className="ml-auto size-1.5 rounded-full bg-primary" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const current = allNavItems.find((i) => i.to === path);

  useEffect(() => setMobileOpen(false), [path]);

  return (
    <div className="flex min-h-screen w-full">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 md:flex",
          collapsed ? "w-16" : "w-[260px]",
        )}
      >
        <div className={cn("flex h-16 items-center border-b border-sidebar-border", collapsed ? "justify-center" : "px-4")}>
          <Logo compact={collapsed} />
        </div>
        <SidebarNav compact={collapsed} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="animate-fade-up absolute inset-y-0 left-0 flex w-[280px] flex-col border-r border-sidebar-border bg-sidebar">
            <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
              <Logo />
              <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary">
                <X className="size-4" />
              </button>
            </div>
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur md:px-6">
          <button aria-label="Open menu" onClick={() => setMobileOpen(true)} className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary md:hidden">
            <Menu className="size-5" />
          </button>
          <button
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed((c) => !c)}
            className="hidden rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground md:inline-flex"
          >
            {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          </button>
          <div className="hidden text-sm text-muted-foreground sm:block">
            {current ? <><span>{current.group}</span><span className="mx-2 opacity-40">/</span><span className="text-foreground">{current.title}</span></> : <span className="text-foreground">Random Forest Lab</span>}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground lg:flex">
              <Search className="size-3.5" />
              <span className="w-40">Search lessons…</span>
            </div>
            <span className="rounded-md border border-border p-1.5 text-muted-foreground"><Github className="size-4" /></span>
          </div>
        </header>
        <main className="min-w-0 flex-1">{children}</main>
        <footer className="border-t border-border px-6 py-6 text-xs text-muted-foreground">
          Random Forest Lab — From Mathematics to Implementation
        </footer>
      </div>
    </div>
  );
}
