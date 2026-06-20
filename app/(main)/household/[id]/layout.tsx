import Menu from '@/components/household/Menu'
import { getHouseholdById } from '@/actions/household'

export default async function HouseholdLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getHouseholdById(id)

  if (!result.success) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10 text-center text-destructive">
        {result.error}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-[280px] shrink-0 md:block">
        <Menu id={id} name={result.household.name} emoji={result.household.emoji} />
      </aside>
      <main className="min-w-0 flex-1 px-6 py-10 md:px-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  )
}