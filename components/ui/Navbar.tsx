'use client'

import { useRouter } from 'next/navigation'
import { signOut } from '@/actions/auth'

const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/)
    if (words.length === 0) return ''
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
    return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

const Navbar = ({name} : {name : string}) => {
  const router = useRouter();
  const displayInitials = getInitials(name);

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      router.push('/login');
      router.refresh();
    }
  };

  return (
    <header className="w-full bg-[#F6E7D2] border-b border-[#E3D2C2]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C9A589] text-sm font-semibold uppercase text-[#3E2E22] shadow-sm">
            {displayInitials}
          </div>
          <div>
            <p className="text-xl font-semibold tracking-tight text-[#3E2E22]">RoomieTasks</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="rounded-full bg-[#3E2E22] px-4 py-2 text-sm font-semibold text-[#F6E7D2] transition hover:bg-[#2E241D]"
        >
          Sign out
        </button>
      </div>
    </header>
  );
};

export default Navbar;
