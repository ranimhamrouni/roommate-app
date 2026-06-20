'use client'

import { useRouter } from 'next/navigation'
import { signOut } from '@/actions/auth'
import Initials from '../home/Initials';

const Navbar = ({name} : {name : string}) => {
  const router = useRouter();
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
          <Initials name={name}/>
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
