import { Permission } from "@acme/auth/authorization";
import type { Metadata } from "next";
import { AccessBoundary } from "~/components/authorization/access-boundary";
import { AdminSettings } from "~/components/blog/admin-settings";
import { PageHeader } from "~/components/blog/page-header";

export const metadata: Metadata = { title: "Administration" };

export default function AdminPage() {
  return (
    <AccessBoundary permission={Permission.USER_ADMIN} title="Administration">
      <div className="space-y-6">
        <PageHeader
          eyebrow="Workspace"
          title="Administration"
          description="Configure publication defaults, editorial behavior, and security."
        />
        <AdminSettings />
      </div>
    </AccessBoundary>
  );
}
