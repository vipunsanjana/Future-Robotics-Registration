import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard-shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  return (
    <DashboardShell
      email={session.user.email}
      name={session.user.name ?? session.user.email}
      image={session.user.image ?? ""}
      role={(session.user as { role?: string }).role ?? "manager"}
    >
      {children}
    </DashboardShell>
  );
}
