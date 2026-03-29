import type { ReactNode } from 'react'

type BentoCardProps = {
  eyebrow?: string
  title?: string
  className?: string
  children: ReactNode
}

export function BentoCard({
  eyebrow,
  title,
  className = '',
  children,
}: BentoCardProps) {
  return (
    <section
      className={`card-shell animate-rise rounded-[2rem] p-6 md:p-7 ${className}`}
    >
      {(eyebrow || title) && (
        <header className="mb-5 space-y-2">
          {eyebrow ? (
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-stone-500">
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h2 className="font-display text-[1.4rem] leading-tight text-stone-900 md:text-[1.55rem]">
              {title}
            </h2>
          ) : null}
        </header>
      )}
      {children}
    </section>
  )
}
