"use client";
import { useState } from "react";
import { useSite } from "@/contexts/SiteContext";
import AdminSidebar, { SIDEBAR_W_OPEN, SIDEBAR_W_COLLAPSED } from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function AdminShell({ title, children }: Props) {
  const { dark } = useSite();
  const [sidebarOpen,      setSidebarOpen]      = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const BG = dark ? "#050B12" : "#F1F5F9";

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: BG }}>
      <AdminSidebar
        open={sidebarOpen}
        collapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        onToggle={() => setSidebarCollapsed(c => !c)}
      />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          transition: "margin 0.28s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <AdminTopbar
          title={title}
          onMenuClick={() => {
            if (typeof window !== "undefined" && window.innerWidth <= 900) {
              setSidebarOpen(true);
            } else {
              setSidebarCollapsed(c => !c);
            }
          }}
        />
        <main style={{ flex: 1, padding: "28px 24px", overflowX: "hidden" }}>
          {children}
        </main>
      </div>

      {/* Invisible spacer so CSS transition on sidebar width pushes content smoothly */}
      <style>{`
        @media (max-width: 900px) {
          /* On mobile the sidebar is fixed/overlay — no layout shift needed */
        }
      `}</style>
    </div>
  );
}
