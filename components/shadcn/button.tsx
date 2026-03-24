"use client";

import { cn } from "@/lib/utils";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
	"group/button inline-flex shrink-0 items-center justify-center rounded-sm border-2 border-border text-xs font-semibold tracking-[-0.01em] whitespace-nowrap outline-none select-none transition-[box-shadow,background-color,color,border-color,transform,filter] duration-150 ease-out motion-reduce:transition-none shadow-[3px_3px_0_0_rgba(39,47,31,0.88)] dark:shadow-[3px_3px_0_0_rgba(6,8,5,0.55)] focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:shadow-[4px_4px_0_0_rgba(39,47,31,0.88)] dark:hover:shadow-[4px_4px_0_0_rgba(6,8,5,0.62)] hover:saturate-[1.02] active:translate-y-px active:shadow-[2px_2px_0_0_rgba(39,47,31,0.88)] dark:active:shadow-[2px_2px_0_0_rgba(6,8,5,0.5)] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:translate-y-0 aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground hover:bg-primary/95",
				outline:
					"bg-card text-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/90 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
				ghost: "border-transparent bg-transparent text-foreground shadow-none hover:border-border hover:bg-accent hover:text-accent-foreground hover:shadow-none active:translate-y-0 active:shadow-none aria-expanded:bg-accent aria-expanded:text-accent-foreground",
				destructive:
					"bg-destructive text-white hover:bg-destructive/95 focus-visible:border-destructive focus-visible:ring-destructive/30",
				link: "border-0 bg-transparent p-0 text-primary shadow-none hover:bg-transparent hover:text-primary hover:underline hover:shadow-none active:translate-y-0 active:shadow-none underline-offset-4",
			},
			size: {
				default:
					"h-9 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
				xs: "h-6 gap-1 rounded-[0.35rem] px-2 text-[0.625rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-2.5",
				sm: "h-7 gap-1 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
				lg: "h-9 gap-2 px-4 text-sm has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 [&_svg:not([class*='size-'])]:size-4",
				icon: "size-8 [&_svg:not([class*='size-'])]:size-3.5",
				"icon-xs":
					"size-6 rounded-[0.35rem] [&_svg:not([class*='size-'])]:size-2.5",
				"icon-sm": "size-7 [&_svg:not([class*='size-'])]:size-3",
				"icon-lg": "size-9 [&_svg:not([class*='size-'])]:size-4",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function Button({
	className,
	variant = "default",
	size = "default",
	...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
	return (
		<ButtonPrimitive
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
