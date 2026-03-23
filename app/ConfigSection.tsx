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
					Define rules that apply across the app.
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
									<FieldLabel htmlFor={field.name}>
										Participants per team
									</FieldLabel>
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
								<Button type="submit" disabled={!canSubmit}>
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
