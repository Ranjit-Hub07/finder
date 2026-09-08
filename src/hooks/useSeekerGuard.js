"use client";
import { useEffect, useRef } from "react";

export default function useSeekerGuard() {
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return; // avoid double run in dev
    didRun.current = true;

    (async () => {
      try {
        const res = await fetch("/api/auth/check", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (res.status === 401) {
          window.location.replace("/seeker-login");
          return;
        }

        const data = await res.json();

        // ✅ must be seeker
        if (!data?.user || data.user.role !== "seeker") {
          window.location.replace("/seeker-login");
          return;
        }
      } catch {
        window.location.replace("/seeker-login");
      }
    })();
  }, []);
}
