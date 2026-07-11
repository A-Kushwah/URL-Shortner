import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import LinkDetail from "@/components/LinkDetail";

export default async function LinkDetailPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <LinkDetail linkId={params.id} />
    </div>
  );
}
