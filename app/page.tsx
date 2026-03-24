import { Button } from "@/components/shadcn/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/shadcn/card";
import { SourceCodeSquareIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import AnalyticsSection from "./AnalyticsSection";
import ConfigSection from "./ConfigSection";
import MatchesSelection from "./MatchesSelection";
import ParticipantsSection from "./ParticipantsSection";

export default function Home() {
	return (
		<div className="mx-auto w-full max-w-6xl p-4">
			<main className="flex flex-col gap-4">
				<Card>
					<CardHeader>
						<div className="flex justify-between gap-4">
							<div>
								<CardTitle className="text-xl font-bold">
									Vaccone Score
								</CardTitle>
								<CardDescription>
									Compare player impact from saved match
									results.
								</CardDescription>
							</div>
							<div className="flex flex-col items-end gap-1">
								<Link
									href="https://github.com/rvaccone/vaccone-score-web"
									target="_blank"
									rel="noopener noreferrer"
								>
									<Button variant="outline">
										<HugeiconsIcon
											icon={SourceCodeSquareIcon}
										/>
										Website code
									</Button>
								</Link>
								<Link
									href="https://github.com/rvaccone/vaccone-score-analysis"
									target="_blank"
									rel="noopener noreferrer"
								>
									<Button variant="outline">
										<HugeiconsIcon
											icon={SourceCodeSquareIcon}
										/>
										Analytics code
									</Button>
								</Link>
							</div>
						</div>
					</CardHeader>
				</Card>

				<ConfigSection />

				<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
					<div className="lg:col-span-1">
						<ParticipantsSection />
					</div>

					<div className="flex flex-col gap-4 lg:col-span-2">
						<MatchesSelection />

						<AnalyticsSection />
					</div>
				</div>
			</main>
		</div>
	);
}
