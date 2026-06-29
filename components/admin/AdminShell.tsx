"use client";
import { useState } from "react";
import { useSite } from "@/contexts/SiteContext";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function AdminShell({ title, children }: Props) {
  const { dark } = useSite();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const BG = dark ? "#050B12" : "#F1F5F9";

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: BG }}>
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <AdminTopbar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main style={{ flex: 1, padding: "28px 24px", overflowX: "hidden" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
