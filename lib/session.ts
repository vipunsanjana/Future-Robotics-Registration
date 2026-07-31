import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import type { Role } from "./types";

export async function getSessionRole(): Promise<{ email: string; name: string; role: Role } | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  const role = (session.user as { role?: string }).role as Role;
  return { email: session.user.email, name: session.user.name ?? "", role: role ?? "manager" };
}
