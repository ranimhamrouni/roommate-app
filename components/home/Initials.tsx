const Initials = ({name}: {name: string}) => {
    const words = name.trim().split(/\s+/)
    if (words.length === 0) return ''
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
    const displayInitials = (words[0][0] + words[words.length - 1][0]).toUpperCase();
    return (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C9A589] text-sm font-semibold uppercase text-[#3E2E22] shadow-sm">
            {displayInitials}
        </div>
    )
}

export default Initials
