import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils/cn"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  isLoading?: boolean
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', isLoading, children, asChild = false, ...props }, ref) => {
    const childArray = React.Children.toArray(children)
    const isSingleChild = childArray.length === 1 && React.isValidElement(childArray[0])
    const slotChild = isSingleChild ? (childArray[0] as React.ReactElement) : null

    // Maintain same behavior when rendering as child; no debug logs in production

    const baseClass = cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition ease-in-out duration-200 focus:outline-none disabled:pointer-events-none disabled:opacity-60',
      {
        // primary: subtle solid with soft shadow on hover
  'bg-[color:var(--primary)] text-[color:var(--primary-foreground)] border border-transparent hover:shadow-sm': variant === 'default',
        // secondary: neutral surface
        'bg-[color:var(--card)] text-[color:var(--foreground)] border border-[color:var(--border)] hover:shadow-sm': variant === 'secondary',
        'bg-[#ef4444] text-white border-transparent hover:opacity-95': variant === 'destructive',
        'border border-[color:var(--border)] bg-transparent hover:bg-[color:var(--muted)]/40': variant === 'outline',
        'bg-transparent text-[color:var(--foreground)] hover:bg-[color:var(--muted)]/20': variant === 'ghost',
        'bg-transparent text-[color:var(--primary)] underline-offset-4 hover:underline': variant === 'link',
        // sizes
        'h-10 px-4': size === 'default',
        'h-8 px-3 text-sm': size === 'sm',
        'h-12 px-6': size === 'lg',
        'h-10 w-10 p-0': size === 'icon',
      },
      className
    )

    const spinner = isLoading ? (
      <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    ) : null

    // Si asChild y hay un único hijo elemento, clonamos sin Slot para evitar React.Children.only
    if (asChild && slotChild) {
      const originalChildren = slotChild.props?.children
      const mergedChildren = (
        <>
          {spinner}
          {originalChildren}
        </>
      )

      return React.cloneElement(slotChild, {
        className: cn(baseClass, (slotChild.props as any)?.className),
        ref,
        ...props,
        children: mergedChildren,
      })
    }

    // Caso normal: renderizar como button
    return (
      <button
        className={baseClass}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {spinner}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
