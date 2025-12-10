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
      'inline-flex items-center justify-center whitespace-nowrap rounded-md border text-sm font-semibold transition-all duration-300 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-sm active:scale-95',
      {
        'bg-primary text-white border-transparent hover:bg-primary-dark hover:shadow-md hover:scale-105': variant === 'default',
        'bg-surface text-text border border-border hover:shadow-md hover:bg-surface': variant === 'secondary',
        'bg-danger text-white border-transparent hover:bg-danger/90 hover:shadow-md hover:scale-105': variant === 'destructive',
        'border border-border bg-transparent hover:bg-surface hover:border-border/50': variant === 'outline',
        'border-transparent bg-transparent hover:bg-primary-light/10 text-text hover:text-primary-dark': variant === 'ghost',
        'border-transparent bg-transparent text-primary underline-offset-4 hover:underline': variant === 'link',
        'h-11 px-4 py-2.5': size === 'default',
        'h-9 rounded-sm px-3': size === 'sm',
        'h-11 rounded-lg px-8': size === 'lg',
        'h-10 w-10 p-0': size === 'icon',
      },
      className
    )

    const spinner = isLoading ? (
      <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
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
