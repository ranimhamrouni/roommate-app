import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import { getUser } from "@/actions/user";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const result = await getUser();
    if(!result.success) redirect('/login');
    const name = result.user.name;
  return <>
  <Navbar name={name}/>
  {children}
  </>
}