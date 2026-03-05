import { redirect } from "next/navigation";
import { auth } from "@/auth";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  return (
    <div className="min-h-screen bg-base-200 p-4 sm:p-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">My TrustCards</h1>
        <DashboardClient />
      </div>
    </div>
  );
}
