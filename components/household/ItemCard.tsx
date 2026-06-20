import { Card } from "../ui/card"

type colorObjectType = {
  emoji: string
  background: string
  nameColor: string
  subtitleColor: string
}

const ItemCard = ({
  label,
  count,
  emoji,
  colorObject,
}: {
  label: string
  count: number | null
  emoji: string
  colorObject: colorObjectType
}) => {
  return (
    <Card
      style={{ backgroundColor: colorObject.background }}
      className="flex aspect-[4/3] w-full flex-col justify-between rounded-[28px] border-none p-7 shadow-none sm:p-8"
    >
      <span className="text-3xl leading-none sm:text-4xl">{emoji}</span>
      <div className="flex flex-col gap-1">
        <span
          className="text-4xl font-extrabold leading-none sm:text-5xl"
          style={{ color: colorObject.nameColor }}
        >
          {count !== null ? count : "—"}
        </span>
        <span className="text-sm font-medium sm:text-base" style={{ color: colorObject.subtitleColor }}>
          {label}
        </span>
      </div>
    </Card>
  )
}

export default ItemCard