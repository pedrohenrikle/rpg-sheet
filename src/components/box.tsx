import { HTMLAttributes, ReactNode } from 'react'

interface RootProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Root({ children, className, ...props }: RootProps) {
  return (
    <div
      className={`flex flex-col bg-card border border-border p-7 gap-6 rounded-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

interface ChildrenProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Header({ children, className, ...props }: ChildrenProps) {
  return (
    <section
      className={`flex items-center gap-5 font-bold text-xl ${className}`}
      {...props}
    >
      {children}
    </section>
  )
}

export function Content({ children, className, ...props }: ChildrenProps) {
  return (
    <div className={`leading-relaxed text-sm ${className}`} {...props}>
      {children}
    </div>
  )
}

export function Icon({ children, className, ...props }: ChildrenProps) {
  return (
    <span className={className} {...props}>
      {children}
    </span>
  )
}
