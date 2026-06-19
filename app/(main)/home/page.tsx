import { getUserHouseholds } from "@/actions/household"
import HouseholdCard from "@/components/home/HouseholdCard";
import CreateHouseholdCard from "@/components/home/CreateHouseholdCard"
import { getUser } from "@/actions/user";
import AlertDestructive from "@/components/ui/AlertDestructive";
import JoinHouseholdBanner from "@/components/home/JoinHouseholdBanner";

const HomePage = async () => {
    const result = await getUserHouseholds();
    if (!result.success) return <p>Error: {result.error}</p>
    const households = result.households;
    const userResult = await getUser();
    if(!userResult.success) return <AlertDestructive errorMessage={userResult.error}/>
    const user = userResult.user;

    return (
        <div className="max-w-4xl mx-auto px-6 py-10">
            <h1 className="text-3xl font-bold font-heading mb-2">Hey {user.name}👋 Your homes</h1>
            <p className="text-muted-foreground mb-8">{households.length} household{households.length !== 1 ? 's' : ''} · pick one to jump in</p>            
            <div className="grid grid-cols-2 gap-6">
                {households.map((household) => (
                    <HouseholdCard key={household._id.toString()} id={household._id.toString()} name={household.name} address={household.address} emoji={household.emoji}/>
                ))}
                <CreateHouseholdCard />
                <JoinHouseholdBanner/>
            </div>
        </div>
    )
}

export default HomePage
