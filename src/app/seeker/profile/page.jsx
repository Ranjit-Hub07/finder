
export const dynamic = "force-dynamic";
import { Suspense } from "react";
import ProfileLayout from "./layout";

// The default export for a page file in Next.js App Router.
export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
          <div className="spinner-border text-primary" role="status" />
        </div>
      }
    >
      <ProfileLayout />
    </Suspense>
  );
}



