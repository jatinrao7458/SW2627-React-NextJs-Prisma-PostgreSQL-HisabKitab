"use client";

import { useState } from "react";
import AppSidebar from "@/components/layout/AppSidebar";
import AppHeader from "@/components/layout/AppHeader";
import styles from "./Layout.module.css";
import AutoRefresher from "@/components/layout/AutoRefresher";
import CacheProvider from "@/components/providers/CacheProvider";

export default function DashboardLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <CacheProvider>
      <div className={styles.layout}>
        <AutoRefresher interval={10000} />
        <AppSidebar
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />
        
        <div
          className={`${styles.mainWrapper} ${
            isSidebarCollapsed ? styles.mainWrapperCollapsed : ""
          }`}
        >
          <AppHeader />
          <main className={styles.content}>{children}</main>
        </div>
      </div>
    </CacheProvider>
  );
}
