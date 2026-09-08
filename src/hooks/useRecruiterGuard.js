"use client";
import { useEffect, useRef } from "react";

export default function useRecruiterGuard() {
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return; // avoid double run in dev strict mode
    didRun.current = true;

    (async () => {
      try {
        const res = await fetch("/api/auth/check", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (res.status === 401) {
          window.location.replace("/recruiter-login");
          return;
        }

        const data = await res.json();

        if (!data?.user || data.user.role !== "recruiter") {
          window.location.replace("/recruiter-login");
          return;
        }
      } catch {
        window.location.replace("/recruiter-login");
      }
    })();
  }, []);
}
