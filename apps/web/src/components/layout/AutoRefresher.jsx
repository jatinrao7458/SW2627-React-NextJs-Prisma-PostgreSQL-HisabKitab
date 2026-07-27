"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AutoRefresher({ interval = 10000 }) {
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      // router.refresh() fetches the latest Server Component payload
      // without losing client state (e.g. open modals, typed input)
      router.refresh();
    }, interval);

    return () => clearInterval(timer);
  }, [router, interval]);

  // This component renders nothing; it just handles background logic
  return null;
}
