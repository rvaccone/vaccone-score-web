"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/shadcn/card";
import { AnalyticsProgram } from "@/lib/analytics";
import { useMatchesStore } from "@/stores/matches";
import { ChampionIcon, SadDizzyIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Effect } from "effect";
import { useMemo } from "react";

export default function AnalyticsSection() {
	// Hooks
	const { matches } = useMatchesStore();

	// Memos
	const result = useMemo(() => {
		if (matches.length === 0) {
			return {
				status: "empty" as const,
			};
		}

		const either = Effect.runSync(
			Effect.either(
				AnalyticsProgram({
					matches,
				}),
			),
		);

		if (either._tag === "Left")
			return {
				status: "error" as const,
				message: either.left.message,
			};

		return {
			status: "success" as const,
			data: either.right,
		};
	}, [matches]);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Analytics</CardTitle>
				<CardDescription>
					View the current rankings and other stats.
				</CardDescription>
			</CardHeader>
			<CardContent>
				{result.status === "empty" && (
					<p className="text-muted-foreground text-sm">
						Add some matches to see rankings.
					</p>
				)}

				{result.status === "error" && (
					<p className="text-sm text-red-500">{result.message}</p>
				)}

				{result.status === "success" && (
					<div className="space-y-4">
						<div className="grid gap-2 sm:grid-cols-3">
							<div className="rounded-md border p-3">
								<div className="text-muted-foreground">
									Total Matches
								</div>
								<div className="text-lg font-semibold">
									{result.data.matchCount}
								</div>
							</div>

							<div className="rounded-md border p-3">
								<div className="text-muted-foreground">
									Margin RMSE
								</div>
								<div className="text-lg font-semibold">
									{result.data.rmse.toFixed(2)}
								</div>
							</div>

							<div className="rounded-md border p-3">
								<div className="text-muted-foreground">
									Margin MAE
								</div>
								<div className="text-lg font-semibold">
									{result.data.mae.toFixed(2)}
								</div>
							</div>
						</div>

						<div className="space-y-2">
							{result.data.ranking.map((entry, index) => (
								<div
									key={entry.participant}
									className="flex items-center justify-between rounded-md border p-3"
								>
									<div>
										<div className="flex items-start gap-2">
											<p>
												{index + 1}.{" "}
												{entry.participant}{" "}
											</p>
											{index === 0 && (
												<HugeiconsIcon
													icon={ChampionIcon}
													size={16}
													strokeWidth={1.5}
												/>
											)}
											{index ===
												result.data.ranking.length -
													1 && (
												<HugeiconsIcon
													icon={SadDizzyIcon}
													size={16}
													strokeWidth={1.5}
												/>
											)}
										</div>
										<div className="text-muted-foreground text-sm">
											{entry.wins} Wins - {entry.losses}{" "}
											Losses • {entry.matchesPlayed}{" "}
											matches
										</div>
									</div>

									<div className="text-right">
										<div className="font-semibold">
											{entry.rating.toFixed(2)} Rating
										</div>
										<div className="text-muted-foreground text-sm">
											Net Points {entry.pointDifferential}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
