import { getUser } from "@/actions/user";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const result = await getUser();
  if(result.success && result.user) redirect('/home');
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      {children}
    </div>
  )
}