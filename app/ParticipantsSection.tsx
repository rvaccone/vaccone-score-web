"use client";

import { Button } from "@/components/shadcn/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/shadcn/card";
import { Field, FieldError, FieldLabel } from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemTitle,
} from "@/components/shadcn/item";
import { useParticipantStore } from "@/stores/participants";
import {
	CircleArrowReload01Icon,
	PlusSignCircleIcon,
	RemoveCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useForm } from "@tanstack/react-form";
import { Schema } from "effect";

const AddParticipantFormSchema = Schema.standardSchemaV1(
	Schema.Struct({
		name: Schema.NonEmptyString.pipe(
			Schema.minLength(3),
			Schema.annotations({
				message: () => "You must have a length of at least 3",
			}),
		),
	}),
);

export default function ParticipantsSection() {
	// Hooks
	const {
		participants,
		addParticipant,
		removeParticipant,
		resetParticipants,
	} = useParticipantStore();
	const form = useForm({
		defaultValues: {
			name: "",
		},
		validators: {
			onSubmit: AddParticipantFormSchema,
		},
		onSubmit: async ({ value }) => {
			const { name } = value;
			addParticipant(name);
			console.log(value);
			form.reset();
		},
	});

	return (
		<Card>
			<CardHeader>
				<div className="flex items-start justify-between gap-4">
					<div>
						<CardTitle>Participants</CardTitle>
						<CardDescription>
							See available participants and add new ones.
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<form
					onSubmit={(event) => {
						event.preventDefault();
						form.handleSubmit();
					}}
					className="mt-4"
				>
					<form.Subscribe
						selector={(state) => state.values.name}
						children={(name) => {
							const displayedParticipants = participants.filter(
								(participant) => participant.includes(name),
							);

							return (
								<div>
									{/* Participant search and add */}
									<div className="flex items-end gap-4">
										<form.Field
											name="name"
											children={(field) => (
												<Field
													data-invalid={
														field.state.meta.errors
															.length > 0
													}
												>
													<FieldLabel
														htmlFor={field.name}
													>
														Name
													</FieldLabel>
													<Input
														id={field.name}
														name={field.name}
														value={
															field.state.value
														}
														onBlur={
															field.handleBlur
														}
														onChange={(event) =>
															field.handleChange(
																event.target
																	.value,
															)
														}
														aria-invalid={
															field.state.meta
																.errors.length >
															0
														}
														placeholder="Rocco Vaccone"
													/>
													<FieldError
														errors={
															field.state.meta
																.errors
														}
													/>
												</Field>
											)}
										/>
										<Button type="submit">
											<HugeiconsIcon
												icon={PlusSignCircleIcon}
											/>
											Add
										</Button>
									</div>

									{/* Participant list */}
									<div className="mt-4 grid gap-2">
										{displayedParticipants.map(
											(participant) => (
												<Item
													key={participant}
													className="border-border"
												>
													<ItemContent>
														<ItemTitle>
															{participant}
														</ItemTitle>
													</ItemContent>
													<ItemActions>
														<Button
															onClick={() => {
																removeParticipant(
																	participant,
																);
															}}
														>
															<HugeiconsIcon
																icon={
																	RemoveCircleIcon
																}
															/>
															Remove
														</Button>
													</ItemActions>
												</Item>
											),
										)}
									</div>
								</div>
							);
						}}
					/>
				</form>

				{/* Reset participants */}
				{participants.length > 0 && (
					<div className="mt-4">
						<Button
							variant="outline"
							onClick={() => {
								resetParticipants();
							}}
							className="w-full"
						>
							<HugeiconsIcon icon={CircleArrowReload01Icon} />
							Reset participants
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
