import type { Metadata } from "next";

import { AdminLogin } from "~/components/authorization/admin-login";

export const metadata: Metadata = { title: "Administration sign in" };

export default function LoginPage() {
  return <AdminLogin />;
}
