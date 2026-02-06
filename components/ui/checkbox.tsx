"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface CheckboxProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    checked?: boolean
    onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
    ({ className, checked, onCheckedChange, ...props }, ref) => {
        return (
            <button
                type="button"
                role="checkbox"
                aria-checked={checked}
                onClick={() => onCheckedChange?.(!checked)}
                className={cn(
                    "peer h-4 w-4 shrink-0 rounded-sm border border-blue-600 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white",
                    checked ? "bg-blue-600 text-white" : "bg-white",
                    className
                )}
                ref={ref}
                {...props}
            >
                {checked && <Check className="h-3.5 w-3.5" />}
            </button>
        )
    }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
