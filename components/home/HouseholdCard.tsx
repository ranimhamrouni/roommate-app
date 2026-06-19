import Link from 'next/link'
import { Card } from '../ui/card'
import { EMOJI_OPTIONS } from '@/lib/constants'
import { ArrowRight } from 'lucide-react'
const HouseholdCard = ({id, name, address, emoji}: {id: string, name: string, address: string, emoji: string}) => {
    const option = EMOJI_OPTIONS.find(o => o.emoji === emoji)!
       
    return (
        <Link href={`/household/${id}`}>
            <Card style={{ backgroundColor: option.background }} className="w-100 h-50 min-h-[160px] rounded-[28px] flex flex-col p-8 gap-2 transition cursor-pointer hover:opacity-90 hover:scale-105 hover:shadow-xl relative group">
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <ArrowRight size={20} style={{ color: option.subtitleColor }} />
                </div>
                <div className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl bg-white/30 -mt-1">
                    {emoji}
                </div>
                <h3 className="text-2xl font-bold mb-0" style={{ color: option.nameColor }}>{name}</h3>
                <p className="text-sm" style={{ color: option.subtitleColor }}>{address}</p>
            </Card>
        </Link>
  )
}

export default HouseholdCard
