'use client'

const URL_REGEX = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi

export function LinkifiedText({ text, className = '' }: { text: string; className?: string }) {
  if (!text) return null

  const parts = text.split(URL_REGEX)

  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (!part) return null
        const isUrl = /^(https?:\/\/|www\.)/i.test(part)
        if (isUrl) {
          const href = part.startsWith('www.') ? `https://${part}` : part
          return (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:text-primary/80 break-all"
              onClick={(e) => e.stopPropagation()}
            >
              {part}
            </a>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </span>
  )
}
