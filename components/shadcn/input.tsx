import { cn } from "@/lib/utils";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { ComponentProps } from "react";

function Input({ className, type, ...props }: ComponentProps<"input">) {
	return (
		<InputPrimitive
			type={type}
			data-slot="input"
			className={cn(
				"neo-surface-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/30 focus-visible:ring-offset-background aria-invalid:border-destructive aria-invalid:ring-destructive/20 transition- box-shadow,border-color,background-color] h-9 w-full min-w-0 px-3 py-2 text-sm tracking-[-0.01em] outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-xs file:font-semibold focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none aria-invalid:ring-2",
				className,
			)}
			{...props}
		/>
	);
}

export { Input };
