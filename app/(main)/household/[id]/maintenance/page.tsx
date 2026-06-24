import { getItems } from "@/actions/maintenance"
import { EMOJI_OPTIONS } from "@/lib/constants"
import MaintenanceItemsList from "@/components/maintenance/MaintenanceItemsList"

const page = async ({params} : {params: Promise<{id: string}>}) => {
    const {id} = await params;
    const itemsResult = await getItems(id);
    if(!itemsResult.success) return <p>{itemsResult.error}</p>
    const chores = itemsResult.items;

  return (
    <div className="w-full">
        <h3 className="text-2xl font-bold mt-1" style={{ color: EMOJI_OPTIONS[7].nameColor }}>
            Maintenance List 🔧 
        </h3>
        <MaintenanceItemsList householdId={id} itemsArray={chores}/>
    </div>
  )
}

export default page
