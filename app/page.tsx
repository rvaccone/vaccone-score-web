import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/shadcn/card";
import ParticipantsSection from "./ParticipantsSection";

export default function Home() {
	return (
		<div className="mx-auto w-full max-w-6xl p-4">
			<main className="flex flex-col gap-4">
				<Card>
					<CardHeader>
						<CardTitle className="text-xl font-bold">
							Vaccone Score
						</CardTitle>
						<CardDescription>
							Track the best participants across multiple games.
						</CardDescription>
					</CardHeader>
				</Card>

				<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
					<div className="lg:col-span-1">
						<ParticipantsSection />
					</div>

					<div className="flex flex-col gap-4 lg:col-span-2">
						<Card>
							<CardHeader>
								<CardTitle>Matches</CardTitle>
								<CardDescription>
									Enter the information for each match.
								</CardDescription>
							</CardHeader>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Analytics</CardTitle>
								<CardDescription>
									View the current rankings and other stats.
								</CardDescription>
							</CardHeader>
						</Card>
					</div>
				</div>
			</main>
		</div>
	);
}
