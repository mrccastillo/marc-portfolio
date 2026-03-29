import type { CSSProperties, ReactNode } from 'react'

type BentoCardProps = {
  id?: string
  eyebrow?: string
  title?: string
  className?: string
  style?: CSSProperties
  children: ReactNode
}

export function BentoCard({
  id,
  eyebrow,
  title,
  className = '',
  style,
  children,
}: BentoCardProps) {
  return (
    <section
      id={id}
      style={style}
      className={`card-shell animate-rise h-full rounded-[1.5rem] p-3.5 md:p-4 xl:p-4.5 ${className}`}
    >
      {(eyebrow || title) && (
        <header className="mb-2.5 space-y-1 xl:mb-3">
          {eyebrow ? (
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-stone-500 xl:text-[0.7rem]">
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h2 className="font-display text-[1.05rem] leading-tight text-stone-900 md:text-[1.12rem] xl:text-[1.24rem]">
              {title}
            </h2>
          ) : null}
        </header>
      )}
      {children}
    </section>
  )
}
