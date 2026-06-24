'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { House, ListTodo, ShoppingCart, CalendarDays, Toolbox } from 'lucide-react'

const items = [
  { icon: <House />, text: 'Home' },
  { icon: <ListTodo />, text: 'Chores' },
  { icon: <ShoppingCart />, text: 'Shopping' },
  { icon: <CalendarDays />, text: 'Calendar' },
  { icon: <Toolbox />, text: 'Maintenance' },
]

const Menu = ({ id, name, emoji }: { id: string; name: string; emoji: string }) => {
  const pathname = usePathname()

  return (
    <div className="h-full min-h-screen w-full bg-[#F6E7D2] p-6 text-[#6A4F34]">
      <Link href="/home" className="mb-6 block text-sm font-medium text-[#6A4F34] hover:text-[#5B4028]">
        {'< All households'}
      </Link>

      <div className="mb-8">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-white/80 text-2xl text-[#6A4F34]">
          {emoji}
        </div>
        <p className="text-lg font-semibold text-[#3E2610]">{name}</p>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const href = item.text === 'Home' ? `/household/${id}` : `/household/${id}/${item.text.toLowerCase()}`
          const isActive = pathname === href

          return (
            <Link
              href={href}
              key={item.text}
              className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-white/80 text-[#543A20]"
                  : "text-[#6A4F34] hover:bg-white/80 hover:text-[#543A20]"
              }`}
            >
              {item.icon} {item.text}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default Menu