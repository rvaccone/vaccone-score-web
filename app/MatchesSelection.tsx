"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/shadcn/accordion";
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
	ItemDescription,
	ItemTitle,
} from "@/components/shadcn/item";
import { useConfigStore } from "@/stores/config";
import { useMatchesStore } from "@/stores/matches";
import { useParticipantStore } from "@/stores/participants";
import {
	CircleArrowReload01Icon,
	RemoveCircleIcon,
	SaveIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useForm } from "@tanstack/react-form";
import { Schema } from "effect";
import { v4 as uuidv4 } from "uuid";
import TeamPicker from "./TeamPicker";

const collator = new Intl.Collator("en", {
	sensitivity: "base",
});

const sortNames = (names: string[]) =>
	[...names].sort((a, b) => collator.compare(a, b));

const AddMatchFormSchema = Schema.standardSchemaV1(
	Schema.Struct({
		teamA: Schema.mutable(Schema.Array(Schema.String)),
		teamB: Schema.mutable(Schema.Array(Schema.String)),
		scoreA: Schema.Number.pipe(Schema.greaterThanOrEqualTo(0)),
		scoreB: Schema.Number.pipe(Schema.greaterThanOrEqualTo(0)),
	}),
);

export default function MatchesSelection() {
	// Hooks
	const { participantsPerTeam } = useConfigStore();
	const { matches, addMatch, removeMatch, resetMatches } = useMatchesStore();
	const { participants } = useParticipantStore();
	const form = useForm({
		defaultValues: {
			teamA: [] as string[],
			teamB: [] as string[],
			scoreA: 0,
			scoreB: 0,
		},
		validators: {
			onSubmit: AddMatchFormSchema,
		},
		onSubmit: async ({ value }) => {
			addMatch({
				...value,
				id: uuidv4(),
				createdAt: new Date().toISOString(),
				teamA: sortNames(value.teamA),
				teamB: sortNames(value.teamB),
			});
			form.reset();
		},
	});

	return (
		<Card>
			<CardHeader>
				<div className="flex justify-between gap-4">
					<div>
						<CardTitle>Matches</CardTitle>
						<CardDescription>
							Enter the information for each match.
						</CardDescription>
					</div>

					<p className="text-muted-foreground">
						{matches.length} matches saved
					</p>
				</div>
			</CardHeader>

			<CardContent>
				<form
					onSubmit={(event) => {
						event.preventDefault();
						event.stopPropagation();
						form.handleSubmit();
					}}
					className="mt-4"
				>
					<form.Subscribe
						selector={(state) => state.values}
						children={(values) => {
							const teamAReady =
								values.teamA.length === participantsPerTeam;
							const teamBReady =
								values.teamB.length === participantsPerTeam;
							const canSubmit = teamAReady && teamBReady;

							return (
								<div>
									<h1 className="text-lg font-semibold">
										Add new match
									</h1>
									<div className="grid gap-4 lg:grid-cols-2">
										<TeamPicker
											label="Team A"
											sublabel={`(${values.teamA.length} / ${participantsPerTeam})`}
											selected={values.teamA}
											blocked={values.teamB}
											participants={participants}
											maxSelected={participantsPerTeam}
											invalid={
												!teamAReady &&
												values.teamA.length > 0
											}
											onChangeAction={(next) => {
												form.setFieldValue(
													"teamA",
													next,
												);
											}}
										/>

										<TeamPicker
											label="Team B"
											sublabel={`(${values.teamB.length} / ${participantsPerTeam})`}
											selected={values.teamB}
											blocked={values.teamA}
											participants={participants}
											maxSelected={participantsPerTeam}
											invalid={
												!teamBReady &&
												values.teamB.length > 0
											}
											onChangeAction={(next) => {
												form.setFieldValue(
													"teamB",
													next,
												);
											}}
										/>
									</div>

									<div className="mt-4 grid gap-4 lg:grid-cols-2">
										<form.Field
											name="scoreA"
											children={(field) => (
												<Field>
													<FieldLabel
														htmlFor={field.name}
													>
														Team A score
													</FieldLabel>
													<Input
														id={field.name}
														name={field.name}
														type="number"
														inputMode="numeric"
														min={0}
														value={String(
															field.state.value,
														)}
														onBlur={
															field.handleBlur
														}
														onChange={(event) => {
															const value =
																Number(
																	event.target
																		.value,
																);
															field.handleChange(
																Number.isNaN(
																	value,
																)
																	? 0
																	: value,
															);
														}}
														placeholder="11"
														className="[appearance:textfield] [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
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

										<form.Field
											name="scoreB"
											children={(field) => (
												<Field>
													<FieldLabel
														htmlFor={field.name}
													>
														Team B score
													</FieldLabel>
													<Input
														id={field.name}
														name={field.name}
														type="number"
														inputMode="numeric"
														min={0}
														value={String(
															field.state.value,
														)}
														onBlur={
															field.handleBlur
														}
														onChange={(event) => {
															const value =
																Number(
																	event.target
																		.value,
																);
															field.handleChange(
																Number.isNaN(
																	value,
																)
																	? 0
																	: value,
															);
														}}
														placeholder="10"
														className="[appearance:textfield] [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
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
									</div>

									<div className="mt-2 flex justify-end">
										<Button
											type="submit"
											disabled={!canSubmit}
										>
											<HugeiconsIcon icon={SaveIcon} />
											Save match
										</Button>
									</div>
								</div>
							);
						}}
					/>
				</form>

				<Accordion defaultValue={["history"]} className="mt-4">
					<AccordionItem value="history">
						<AccordionTrigger>View history</AccordionTrigger>
						<AccordionContent>
							{/* Fallback */}
							{matches.length === 0 && (
								<Item className="border-border neo-surface-xs">
									<ItemContent>
										<ItemTitle>No matches saved</ItemTitle>
									</ItemContent>
								</Item>
							)}

							{/* Matches history */}
							<div className="space-y-1">
								{matches.length > 0 &&
									matches.map((match) => (
										<Item
											key={match.id}
											className="border-border neo-surface-xs"
										>
											<ItemContent>
												<div className="flex items-center justify-between gap-4">
													<div className="flex gap-2">
														<div className="flex gap-1">
															<ItemTitle>
																{match.teamA.join(
																	", ",
																)}{" "}
															</ItemTitle>
															<ItemDescription>
																({match.scoreA})
															</ItemDescription>
														</div>
														<ItemTitle className="text-muted-foreground">
															VS
														</ItemTitle>
														<div className="flex gap-1">
															<ItemTitle>
																{match.teamB.join(
																	", ",
																)}{" "}
															</ItemTitle>
															<ItemDescription>
																({match.scoreB})
															</ItemDescription>
														</div>
													</div>
													<ItemDescription>
														{new Date(
															match.createdAt,
														).toLocaleString()}
													</ItemDescription>
												</div>
											</ItemContent>
											<ItemActions>
												<Button
													variant="outline"
													onClick={() => {
														removeMatch(match.id);
													}}
												>
													<HugeiconsIcon
														icon={RemoveCircleIcon}
													/>
													Remove
												</Button>
											</ItemActions>
										</Item>
									))}
							</div>

							{/* Reset matches */}
							{matches.length > 0 && (
								<div className="mt-4">
									<Button
										variant="outline"
										onClick={() => {
											resetMatches();
										}}
										className="w-full"
									>
										<HugeiconsIcon
											icon={CircleArrowReload01Icon}
										/>
										Reset matches
									</Button>
								</div>
							)}
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</CardContent>
		</Card>
	);
}
