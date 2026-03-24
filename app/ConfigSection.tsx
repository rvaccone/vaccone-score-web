"use client";

import { Tooltip } from "@/components/help/tooltip";
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
import { useConfigStore } from "@/stores/config";
import { SaveIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useForm } from "@tanstack/react-form";
import { Schema } from "effect";

const ConfigFormSchema = Schema.standardSchemaV1(
	Schema.Struct({
		participantsPerTeam: Schema.Number.pipe(),
	}),
);

export default function ConfigSection() {
	// Hooks
	const { participantsPerTeam, setParticipantsPerTeam } = useConfigStore();
	const form = useForm({
		defaultValues: {
			participantsPerTeam,
		},
		validators: {
			onSubmit: ConfigFormSchema,
		},
		onSubmit: async ({ value }) => {
			const { participantsPerTeam } = value;
			setParticipantsPerTeam(participantsPerTeam);
		},
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>Configuration</CardTitle>
				<CardDescription>
					Set the team size used for new matches.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					onSubmit={(event) => {
						event.preventDefault();
						form.handleSubmit();
					}}
					className="mt-4"
				>
					<div className="flex items-end gap-4">
						<form.Field
							name="participantsPerTeam"
							children={(field) => (
								<Field
									data-invalid={
										field.state.meta.errors.length > 0
									}
								>
									<div className="flex items-center gap-2">
										<FieldLabel htmlFor={field.name}>
											Participants per team
										</FieldLabel>
										<Tooltip title="Participants per team">
											<div className="space-y-2">
												<p>
													This controls how many
													players can be selected on
													each side.
												</p>
												<p>
													In the analysis, each
													selected player contributes
													an equal share of their
													team.
												</p>
											</div>
										</Tooltip>
									</div>
									<Input
										id={field.name}
										name={field.name}
										type="number"
										min={1}
										value={String(field.state.value)}
										onBlur={field.handleBlur}
										onChange={(event) => {
											const nextValue = Number(
												event.target.value,
											);
											field.handleChange(
												!Number.isNaN(nextValue)
													? nextValue
													: 1,
											);
										}}
										aria-invalid={
											field.state.meta.errors.length > 0
										}
										placeholder="2"
										className="[appearance:textfield] [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
									/>
									<FieldError
										errors={field.state.meta.errors}
									/>
								</Field>
							)}
						/>

						<form.Subscribe
							selector={(state) => [
								state.canSubmit,
								state.isSubmitting,
							]}
							children={([canSubmit, isSubmitting]) => (
								<Button
									type="submit"
									disabled={!canSubmit}
									variant="outline"
								>
									<HugeiconsIcon icon={SaveIcon} />
									{isSubmitting ? "Saving..." : "Save"}
								</Button>
							)}
						/>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
