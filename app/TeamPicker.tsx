"use client";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/shadcn/command";
import { Field, FieldLabel } from "@/components/shadcn/field";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/shadcn/popover";
import { cn } from "@/lib/utils";
import { AddTeamIcon, Tick01Icon, X } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo, useState } from "react";

type TeamPickerProps = {
	label: string;
	selected: string[];
	blocked: string[];
	participants: string[];
	maxSelected: number;
	invalid?: boolean;
	onChangeAction: (next: string[]) => void;
};

export default function TeamPicker({
	label,
	selected,
	blocked,
	participants,
	maxSelected,
	invalid,
	onChangeAction,
}: TeamPickerProps) {
	// State
	const [open, setOpen] = useState(false);

	// Memos
	const availableParticipants = useMemo(
		() =>
			participants.filter(
				(participant) => !blocked.includes(participant),
			),
		[participants, blocked],
	);

	// Handlers
	const toggleParticipant = (participant: string) => {
		const isSelected = selected.includes(participant);

		if (isSelected) {
			onChangeAction(selected.filter((value) => value !== participant));
			return;
		}

		if (selected.length < maxSelected)
			onChangeAction([...selected, participant]);
	};

	return (
		<Field data-invalid={invalid}>
			<FieldLabel>{label}</FieldLabel>

			<div className="space-y-2">
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger>
						<Button
							type="button"
							role="combobox"
							aria-expanded={open}
							aria-invalid={invalid}
							className="w-full justify-between"
						>
							<HugeiconsIcon icon={AddTeamIcon} />
							{selected.length > 0
								? `${selected.length} selected`
								: "Select participants..."}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-(--radix-popover-trigger-width) p-0">
						<Command>
							<CommandInput placeholder="Search participants..." />
							<CommandList>
								<CommandEmpty>
									No participants found.
								</CommandEmpty>
								<CommandGroup>
									{availableParticipants.map(
										(participant) => {
											const isSelected =
												selected.includes(participant);

											return (
												<CommandItem
													key={participant}
													value={participant}
													onSelect={() => {
														toggleParticipant(
															participant,
														);
													}}
												>
													<HugeiconsIcon
														icon={Tick01Icon}
														className={cn(
															!isSelected &&
																"opacity-0",
														)}
													/>
													{participant}
												</CommandItem>
											);
										},
									)}
								</CommandGroup>
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>

				{selected.length > 0 && (
					<div className="flex flex-wrap gap-2">
						{selected.map((participant) => (
							<Badge key={participant} className="gap-1 pr-1">
								{participant}
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="h-5 w-5"
									onClick={() => {
										onChangeAction(
											selected.filter(
												(value) =>
													value !== participant,
											),
										);
									}}
								>
									<HugeiconsIcon icon={X} />
								</Button>
							</Badge>
						))}
					</div>
				)}
			</div>
		</Field>
	);
}
