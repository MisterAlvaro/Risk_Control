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

    // LOG DEBUG: tipo y valor de children
    console.log('%c[Button asChild debug] children:', 'color: orange', children)
    console.log('%c[Button asChild debug] childArray:', 'color: orange', childArray)
    if (asChild && !slotChild) {
      console.error('%c[Button asChild ERROR] slotChild falsy. childArray:', 'color: red', childArray, '\nOriginal children:', children)
    }
    if (asChild && childArray.length !== 1) {
      console.warn('%c[Button asChild WARN] childArray.length:', 'color: gold', childArray.length, 'VAL:', childArray)
    }

    const baseClass = cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-lg border text-sm font-semibold transition-all duration-150 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-sm',
      {
        'bg-primary text-primary-foreground border-primary/70 hover:bg-primary/90 hover:shadow-md': variant === 'default',
        'bg-secondary text-secondary-foreground border-secondary/70 hover:bg-secondary/85 hover:shadow-md': variant === 'secondary',
        'border-destructive/70 bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:text-destructive-foreground': variant === 'destructive',
        'border-border/80 bg-background/80 hover:bg-primary/5 hover:text-foreground': variant === 'outline',
        'border-transparent bg-transparent hover:bg-primary/8': variant === 'ghost',
        'border-transparent bg-transparent text-primary underline-offset-4 hover:underline': variant === 'link',
        'h-10 px-4 py-2': size === 'default',
        'h-9 rounded-md px-3': size === 'sm',
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
