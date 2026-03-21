"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/shadcn/card";
import { api } from "@/lib/api";
import { useMatchesStore } from "@/stores/matches";
import { AnalysisResults } from "@/types/analysis";
import { ChampionIcon, SadDizzyIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";

export default function AnalyticsSection() {
	// Hooks
	const { matches } = useMatchesStore();

	// Queries
	const {
		data: analytics,
		isPending: isPendingAnalytics,
		isSuccess: isSuccessAnalytics,
		error: errorAnalytics,
	} = useQuery({
		queryKey: ["analytics", matches],
		enabled: matches.length > 0,
		queryFn: async () =>
			api
				.post("analyze", {
					json: {
						matches,
					},
				})
				.json<AnalysisResults>(),
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>Analytics</CardTitle>
				<CardDescription>
					View the current rankings and other stats.
				</CardDescription>
			</CardHeader>
			<CardContent>
				{matches.length === 0 && (
					<p className="text-muted-foreground">
						Add some matches to see rankings.
					</p>
				)}

				{isPendingAnalytics && matches.length > 0 && (
					<p className="text-muted-foreground">
						Loading analytics...
					</p>
				)}

				{errorAnalytics && (
					<p className="text-sm text-red-500">
						{errorAnalytics.message}
					</p>
				)}

				{isSuccessAnalytics && analytics && (
					<div className="space-y-4">
						<div className="grid gap-2 sm:grid-cols-3">
							<div className="rounded-md border p-3">
								<div className="text-muted-foreground">
									Total Matches
								</div>
								<div className="text-lg font-semibold">
									{analytics.matchCount}
								</div>
							</div>

							<div className="rounded-md border p-3">
								<div className="text-muted-foreground">
									Margin RMSE
								</div>
								<div className="text-lg font-semibold">
									{analytics.rmse.toFixed(2)}
								</div>
							</div>

							<div className="rounded-md border p-3">
								<div className="text-muted-foreground">
									Margin MAE
								</div>
								<div className="text-lg font-semibold">
									{analytics.mae.toFixed(2)}
								</div>
							</div>
						</div>

						<div className="space-y-2">
							{analytics.ranking.map((entry, index) => (
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
												analytics.ranking.length -
													1 && (
												<HugeiconsIcon
													icon={SadDizzyIcon}
													size={16}
													strokeWidth={1.5}
												/>
											)}
										</div>
										<div className="text-muted-foreground">
											{entry.wins} Wins - {entry.losses}{" "}
											Losses • {entry.matchesPlayed}{" "}
											matches
										</div>
									</div>

									<div className="text-right">
										<div className="font-semibold">
											{entry.rating.toFixed(2)} Rating
										</div>
										<div className="text-muted-foreground">
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
