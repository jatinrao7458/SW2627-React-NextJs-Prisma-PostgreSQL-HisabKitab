"use client";

import { useSession, signOut } from "next-auth/react";
import { Search } from "lucide-react";
import styles from "./AppHeader.module.css";

export default function AppHeader() {
  const { data: session } = useSession();
  const shopName = session?.user?.name ? `${session.user.name}'s Khata` : "Your Khata";

  const getInitials = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1 className={styles.title}>Dashboard</h1>
        <span className={styles.shopBadge}>{shopName}</span>
      </div>

      <div className={styles.right}>
        <button className={styles.searchBtn}>
          <Search size={16} />
          <span>Search transactions...</span>
          <span className={styles.searchShortcut}>⌘K</span>
        </button>

        <div className={styles.profileSection}>
          <span className={styles.greeting}>
            Welcome,{" "}
            <strong className={styles.userName}>
              {session?.user?.name || session?.user?.email || "User"}
            </strong>
          </span>
          <div className={styles.avatar}>
            {getInitials(session?.user?.name || session?.user?.email)}
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className={styles.logoutBtn}
          >
            Log Out
          </button>
        </div>
      </div>
    </header>
  );
}
