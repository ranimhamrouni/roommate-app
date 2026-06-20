'use client'

import { useState } from 'react'
import { EMOJI_OPTIONS } from '@/lib/constants'
import { Card } from '../ui/card'

const InviteCard = ({ inviteCode }: { inviteCode: string }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const style = EMOJI_OPTIONS[5]

  return (
    <Card
      className="flex w-full flex-col items-start gap-4 rounded-[28px] border-none p-6 shadow-none sm:flex-row sm:items-center sm:justify-between sm:p-8"
      style={{ backgroundColor: style.background }}
    >
      <div className="flex-1">
        <h3 className="mb-1 text-xl font-bold sm:text-2xl" style={{ color: style.nameColor }}>
          🔗 Invite a roomie
        </h3>
        <p className="text-sm" style={{ color: style.subtitleColor }}>
          Share this code with someone to join your home!
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="rounded-full bg-white/60 px-5 py-2.5 font-mono text-sm font-semibold tracking-wide text-gray-800">
          {inviteCode}
        </span>

        {!copied ? (
          <button
            onClick={handleCopy}
            className="rounded-full bg-white/60 px-4 py-2.5 text-sm font-semibold text-gray-800 transition hover:bg-white/80"
          >
            Copy
          </button>
        ) : (
          <span className="rounded-full bg-white/60 px-4 py-2.5 text-sm font-semibold text-green-700">
            Copied!
          </span>
        )}
      </div>
    </Card>
  )
}

export default InviteCard