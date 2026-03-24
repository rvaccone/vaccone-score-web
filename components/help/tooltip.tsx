import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/shadcn/hover-card";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, HugeiconsIconProps } from "@hugeicons/react";
import { PropsWithChildren, ReactNode } from "react";

type TooltipProps = {
	title: string;
	iconProps?: HugeiconsIconProps;
};

export const Tooltip = ({
	title,
	iconProps,
	children,
}: PropsWithChildren<TooltipProps>) => {
	return (
		<HoverCard>
			<HoverCardTrigger className="text-muted-foreground hover:text-primary inline-flex items-center transition-all duration-200 ease-in-out hover:scale-105 hover:cursor-help">
				<HugeiconsIcon
					icon={InformationCircleIcon}
					size={16}
					{...iconProps}
				/>
			</HoverCardTrigger>

			<HoverCardContent className="w-72 space-y-2">
				<div className="space-y-1">
					<p className="text-sm font-semibold tracking-[-0.01em]">
						{title}
					</p>
					<div className="text-muted-foreground text-xs leading-5">
						{children}
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
};
