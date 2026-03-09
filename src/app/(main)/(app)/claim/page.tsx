import { redirect } from "next/navigation";
import { auth } from "@/auth";
import ClaimStartupClient from "./ClaimStartupClient";

interface Props {
  searchParams: Promise<{ slug?: string }>;
}

export default async function ClaimPage({ searchParams }: Props) {
  const { slug } = await searchParams;
  const session = await auth();

  if (!slug?.trim()) {
    redirect("/");
  }

  const normalizedSlug = slug.trim().toLowerCase();

  if (!session?.user) {
    redirect(
      `/login?callbackUrl=${encodeURIComponent(`/claim?slug=${normalizedSlug}`)}`,
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-base-200 p-4">
      <ClaimStartupClient slug={normalizedSlug} />
    </div>
  );
}
