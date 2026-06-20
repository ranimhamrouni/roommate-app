import { getHouseholdMembers } from "@/actions/householdMember"
import { Card } from "../ui/card"
import { EMOJI_OPTIONS } from "@/lib/constants"
import { IHousehold } from "@/models/Household"
import Initials from "../home/Initials"

const RoommateCard = async ({ household }: { household: IHousehold }) => {
  const membersResult = await getHouseholdMembers(household._id.toString())
  if (!membersResult.success) return <p>{membersResult.error}</p>
  const members = membersResult.members
  const style = EMOJI_OPTIONS[7]

  return (
    <Card
      className="w-full rounded-[28px] border-none p-6 shadow-none sm:p-8"
      style={{ backgroundColor: style.background }}
    >
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-xl font-bold sm:text-2xl" style={{ color: style.nameColor }}>
          Your roomies
        </h3>
        <span
          className="rounded-full bg-white/60 px-4 py-1.5 text-sm font-medium"
          style={{ color: style.subtitleColor }}
        >
          {household.name} · {members.length} {members.length === 1 ? "person" : "people"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {members.map((member) => (
          <div
            key={member._id.toString()}
            className="flex items-center gap-3 rounded-2xl bg-white/60 px-4 py-3"
          >
            <Initials name={member.userId.name} />
            <span className="text-sm font-medium" style={{ color: style.nameColor }}>
              {member.userId.name}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default RoommateCard