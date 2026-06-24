import { getChores } from "@/actions/chores"
import { EMOJI_OPTIONS } from "@/lib/constants"
import ChoresList from "@/components/chores/ChoresList"
import { getAuthUser } from "@/lib/auth";
import { getHouseholdMembers } from "@/actions/householdMember";

const page = async ({params} : {params: Promise<{id: string}>}) => {
    const {id} = await params;
    const choresResult = await getChores(id);
    if(!choresResult.success) return <p>{choresResult.error}</p>
    const chores = choresResult.chores;
    const userId = await getAuthUser()
    if (!userId) return <p>Not authenticated</p>
    const membersResult = await getHouseholdMembers(id);
    if(!membersResult.success) return <p>{membersResult.error}</p>
    const members = membersResult.members;
  return (
    <div className="w-full">
        <h3 className="text-2xl font-bold mt-1" style={{ color: EMOJI_OPTIONS[7].nameColor }}>
            Chores 🧹
        </h3>
        <ChoresList householdId={id} members={members} userId={userId} choresArray={chores}/>
    </div>
  )
}

export default page
