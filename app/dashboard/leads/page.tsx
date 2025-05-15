import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { columns } from "./columns";
import LeadsClient from "./leads-client";

export default async function LeadsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Leads</h2>
      </div>

      <div className="bg-white py-6">
        <LeadsClient columns={columns} />
      </div>
    </div>
  );
}
