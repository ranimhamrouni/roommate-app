'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const AuthToggle = () => {
  const pathname = usePathname()

  return (
    <div className="flex bg-[#F0EAD6] rounded-2xl p-1 mb-6">
      <Link
        href="/login"
        className={cn(
          "flex-1 text-center py-2 rounded-xl font-semibold transition",
          pathname === '/login' ? 'bg-white text-foreground' : 'text-muted-foreground'
        )}
      >
        Sign in
      </Link>
      <Link
        href="/register"
        className={cn(
          "flex-1 text-center py-2 rounded-xl font-semibold transition",
          pathname === '/register' ? 'bg-white text-foreground' : 'text-muted-foreground'
        )}
      >
        Register
      </Link>
    </div>
  )
}

export default AuthToggle