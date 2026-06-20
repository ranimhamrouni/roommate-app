import { getNumberEvents } from "@/actions/calendar"
import { getNumberPendingChores } from "@/actions/chores"
import { getHouseholdById } from "@/actions/household"
import { getNumberUncompletedMaintenanceItems } from "@/actions/maintenance"
import { getNumberToBuyItems } from "@/actions/shopping"
import { getUser } from "@/actions/user"
import ItemCard from "@/components/household/ItemCard"
import { EMOJI_OPTIONS } from "@/lib/constants"
import InviteCard from "@/components/household/InviteCard"
import RoommateCard from "@/components/household/RoommateCard"

const HouseholdPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const [
    userResult,
    householdResult,
    choresCountResult,
    shoppingCountResult,
    maintenanceCountResult,
    eventsCountResult,
  ] = await Promise.all([
    getUser(),
    getHouseholdById(id),
    getNumberPendingChores(id),
    getNumberToBuyItems(id),
    getNumberUncompletedMaintenanceItems(id),
    getNumberEvents(id),
  ])

  if (!householdResult.success) return <div>{householdResult.error}</div>
  if (!userResult.success) return <div>{userResult.error}</div>
  const household = householdResult.household
  const inviteCode = household.inviteCode

  const stats = [
    { label: "Pending chores", count: choresCountResult.success ? choresCountResult.number : null, emoji: "🧹", colorObject: EMOJI_OPTIONS[0] },
    { label: "Items to buy", count: shoppingCountResult.success ? shoppingCountResult.number : null, emoji: "🛒", colorObject: EMOJI_OPTIONS[3] },
    { label: "Maintenance issues", count: maintenanceCountResult.success ? maintenanceCountResult.number : null, emoji: "🛠️", colorObject: EMOJI_OPTIONS[1] },
    { label: "Events this week", count: eventsCountResult.success ? eventsCountResult.count : null, emoji: "🗓️", colorObject: EMOJI_OPTIONS[4] },
  ]

    return (
    <div className="w-full">
        <div className="mb-8">
        <p className="text-sm" style={{ color: EMOJI_OPTIONS[7].subtitleColor }}>
            {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            })}
        </p>
        <h3 className="text-2xl font-bold mt-1" style={{ color: EMOJI_OPTIONS[7].nameColor }}>
            Hey {userResult.user.name}! 👋
        </h3>
        <p className="text-sm mt-1" style={{ color: EMOJI_OPTIONS[7].subtitleColor }}>
            Here's what's going on in {household.name} today
        </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-5 xl:grid-cols-4">
        {stats.map((stat) => (
            <ItemCard
            key={stat.label}
            label={stat.label}
            count={stat.count}
            emoji={stat.emoji}
            colorObject={stat.colorObject}
            />
        ))}
        </div>

        <div className="mt-8 flex flex-col gap-6">
        <RoommateCard household={household} />
        <InviteCard inviteCode={inviteCode} />
        </div>
    </div>
    )
}

export default HouseholdPage