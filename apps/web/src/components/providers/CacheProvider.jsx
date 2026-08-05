"use client";

import { SWRConfig } from "swr";

// SWR Cache provider that syncs with sessionStorage
function sessionStorageProvider() {
  // When initializing on the server, return a simple Map
  if (typeof window === "undefined") {
    return new Map();
  }

  // Restore the cache from sessionStorage
  const cachedData = sessionStorage.getItem("app-swr-cache");
  const map = new Map(cachedData ? JSON.parse(cachedData) : []);

  // Listen for the beforeunload event to save the cache
  window.addEventListener("beforeunload", () => {
    const appCache = JSON.stringify(Array.from(map.entries()));
    sessionStorage.setItem("app-swr-cache", appCache);
  });

  return map;
}

export default function CacheProvider({ children }) {
  return (
    <SWRConfig 
      value={{
        provider: sessionStorageProvider,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
      }}
    >
      {children}
    </SWRConfig>
  );
}
