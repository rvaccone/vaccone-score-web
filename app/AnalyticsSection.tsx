"use client";

import { Tooltip } from "@/components/help/tooltip";
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
import {
	ChampionIcon,
	NoteIcon,
	SadDizzyIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { BlockMath, InlineMath } from "react-katex";

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
				<div className="flex items-center gap-2">
					<CardTitle>Analytics</CardTitle>
					<Tooltip title="How the model works">
						<div className="space-y-3">
							<p>
								The model looks at each saved match and tries to
								explain the final margin,{" "}
								<InlineMath math="y = s_A - s_B" />.
							</p>

							<p>
								<InlineMath math="y" /> is the margin we want to
								predict, <InlineMath math="s_A" /> is Team A’s
								score, and <InlineMath math="s_B" /> is Team B’s
								score.
							</p>

							<p>
								Each match is turned into a row of player
								weights, and the model uses those weights to
								predict:{" "}
								<InlineMath math="\hat{y} = x \cdot \beta" />.
							</p>

							<p>
								<InlineMath math="\hat{y}" /> is the predicted
								margin, <InlineMath math="x" /> describes who
								played in that match, and{" "}
								<InlineMath math="\beta" /> is the set of player
								ratings the model is learning.
							</p>

							<p>
								If a player is on Team A, their weight is{" "}
								<InlineMath math="1/|A|" />. If they are on Team
								B, their weight is <InlineMath math="-1/|B|" />.
								If they did not play, their weight is{" "}
								<InlineMath math="0" />.
							</p>

							<p>
								The model is comparing the average rating of
								Team A to the average rating of Team B and using
								that difference to predict the result.
							</p>

							<p>
								Ridge regression then chooses the ratings{" "}
								<InlineMath math="\beta" /> that fit the saved
								matches as well as possible, while also
								discouraging ratings from becoming too extreme.
								That makes the results more stable, especially
								when there are not many matches.
							</p>

							<p>
								After fitting, the ratings are centered around
								0. So positive values mean above-average
								estimated impact in this player pool, and
								negative values mean below-average estimated
								impact.
							</p>
						</div>
					</Tooltip>
				</div>
				<CardDescription>
					View player rankings and model accuracy.
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
							<div className="neo-stat">
								<div className="text-muted-foreground flex items-center gap-2">
									Total Matches
									<Tooltip title="Total Matches">
										<div className="space-y-2">
											<p>
												This is the number of matches
												used to fit the ridge regression
												model.
											</p>
											<p>
												More matches usually means more
												stable ratings, especially for
												players who have only appeared a
												few times.
											</p>
											<p>
												With limited data, ridge
												regularization has a stronger
												effect and pulls ratings closer
												to the middle.
											</p>
										</div>
									</Tooltip>
								</div>
								<div className="text-lg font-semibold">
									{analytics.matchCount}
								</div>
							</div>

							<div className="neo-stat">
								<div className="text-muted-foreground flex items-center gap-2">
									Margin RMSE
									<Tooltip title="Margin Root Mean Squared Error">
										<div className="space-y-2">
											<p>
												This measures how far the
												model’s predicted match margins
												are from the actual margins.
											</p>
											<p>
												Here, a predicted margin comes
												from the difference between the
												average player ratings on Team A
												and Team B.
											</p>
											<p>
												Lower is better. RMSE penalizes
												large misses more heavily, so it
												is useful for spotting when the
												model is sometimes very wrong.
											</p>
										</div>
									</Tooltip>
								</div>
								<div className="text-lg font-semibold">
									{analytics.rmse.toFixed(2)}
								</div>
							</div>

							<div className="neo-stat">
								<div className="text-muted-foreground flex items-center gap-2">
									Margin MAE
									<Tooltip title="Margin Mean Absolute Error">
										<div className="space-y-2">
											<p>
												This is the average absolute
												difference between the model’s
												predicted margin and the real
												match margin.
											</p>
											<p>
												Lower is better. MAE is easier
												to interpret than RMSE because
												it tells you the typical error
												size in points.
											</p>
											<p>
												For example, an MAE of 2.5 means
												the predicted margin is off by
												about 2.5 points per match on
												average.
											</p>
										</div>
									</Tooltip>
								</div>
								<div className="text-lg font-semibold">
									{analytics.mae.toFixed(2)}
								</div>
							</div>
						</div>

						<div className="neo-surface-xs flex items-center justify-between gap-4 px-3 py-2">
							<div className="flex items-center gap-2">
								<HugeiconsIcon
									icon={NoteIcon}
									size={16}
									className="shrink-0"
								/>
								<div className="text-muted-foreground text-xs leading-5 font-light">
									Rankings are based on ridge regression
									player ratings.
								</div>
							</div>
							<div className="text-muted-foreground flex flex-col items-center gap-4 text-xs md:flex-row">
								<div className="inline-flex items-center gap-1">
									<p className="font-light">Rating</p>
									<Tooltip title="Player Rating">
										<div className="space-y-2">
											<p>
												This is the ridge regression
												estimate of a player’s
												contribution to expected point
												margin.
											</p>
											<p>
												Ratings are centered around 0,
												so they are best read as
												relative to the average
												participant in this data set.
											</p>
											<p>
												Because ridge regression is
												regularized, extreme values are
												pulled toward 0 unless the match
												data strongly supports them.
											</p>
										</div>
									</Tooltip>
								</div>

								<div className="inline-flex items-center gap-1">
									<p className="font-light">Net Points</p>
									<Tooltip title="Net Points">
										<div className="space-y-2">
											<p>
												This is total points scored
												minus total points allowed
												across saved matches.
											</p>
											<p>
												It is a raw performance summary,
												not a model-based estimate.
											</p>
										</div>
									</Tooltip>
								</div>
							</div>
						</div>

						<div className="space-y-2">
							{analytics.ranking.map((entry, index) => (
								<div
									key={entry.participant}
									className="neo-surface-md flex items-center justify-between gap-4 p-3"
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
												/>
											)}
											{index ===
												analytics.ranking.length -
													1 && (
												<HugeiconsIcon
													icon={SadDizzyIcon}
													size={16}
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
										<p className="font-semibold">
											<span className="font-extrabold">
												{entry.rating.toFixed(2)}
											</span>{" "}
											Rating
										</p>
										<p className="text-muted-foreground">
											<span className="font-extrabold">
												{entry.pointDifferential}
											</span>{" "}
											Net Points
										</p>
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
