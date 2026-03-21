import { ParticipantRating } from "@/types/analysis";
import { Data, Effect } from "effect";
import { Matrix, solve } from "ml-matrix";

export class AnalyticsError extends Data.TaggedError("AnalyticsError") {
	constructor(
		readonly message: string,
		readonly cause?: unknown,
	) {
		super();
	}
}

const EPSILON = 1e-10;

const collectionParticipants = (matches: Match[]) =>
	Array.from(
		new Set(matches.flatMap((match) => [...match.teamA, ...match.teamB])),
	).sort((left, right) => left.localeCompare(right));

const buildParticipantIndex = (participants: string[]) => {
	return new Map(
		participants.map((participant, index) => [participant, index]),
	);
};

const buildDesignMatrix = (matches: Match[], participants: string[]) => {
	const participantIndex = buildParticipantIndex(participants);
	const rowCount = matches.length;
	const columnCount = participants.length;

	const xData = Array.from({ length: rowCount }, () =>
		Array.from({ length: columnCount }, () => 0),
	);

	const yData = matches.map((match) => [match.scoreA - match.scoreB]);

	matches.forEach((match, rowIndex) => {
		const teamAWeight = 1 / match.teamA.length;
		const teamBWeight = 1 / match.teamB.length;

		for (const participant of match.teamA) {
			const columnIndex = participantIndex.get(participant);

			if (columnIndex === undefined) {
				throw new AnalyticsError(
					`Unknown participant on Team A: ${participant}`,
				);
			}

			xData[rowIndex][columnIndex] += teamAWeight;
		}

		for (const participant of match.teamB) {
			const columnIndex = participantIndex.get(participant);

			if (columnIndex === undefined) {
				throw new AnalyticsError(
					`Unknown participant on Team B: ${participant}`,
				);
			}

			xData[rowIndex][columnIndex] -= teamBWeight;
		}
	});

	return {
		X: new Matrix(xData),
		y: new Matrix(yData),
	};
};

const solveRidge = (X: Matrix, y: Matrix, lambda: number) => {
	const xt = X.transpose();
	const xtX = xt.mmul(X);
	const xty = xt.mmul(y);

	for (let i = 0; i < xtX.rows; i += 1) xtX.set(i, i, xtX.get(i, i) + lambda);

	const coefficients = solve(xtX, xty);
	return coefficients.to1DArray();
};

const centerRatings = (ratings: number[]) => {
	if (ratings.length === 0) return ratings;

	const mean =
		ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;

	return ratings.map((rating) => rating - mean);
};

const computeMatchStats = (matches: Match[], participants: string[]) => {
	const stats = new Map<
		string,
		{
			matchesPlayed: number;
			wins: number;
			losses: number;
			pointDifferential: number;
		}
	>();

	for (const participant of participants) {
		stats.set(participant, {
			matchesPlayed: 0,
			wins: 0,
			losses: 0,
			pointDifferential: 0,
		});
	}

	for (const match of matches) {
		const margin = match.scoreA - match.scoreB;
		const teamAWon = margin > 0;
		const teamBWon = margin < 0;

		for (const participant of match.teamA) {
			const current = stats.get(participant);
			if (!current) continue;

			current.matchesPlayed += 1;
			current.pointDifferential += margin;

			if (teamAWon) current.wins += 1;
			if (teamBWon) current.losses += 1;
		}

		for (const participant of match.teamB) {
			const current = stats.get(participant);
			if (!current) continue;

			current.matchesPlayed += 1;
			current.pointDifferential -= margin;

			if (teamBWon) current.wins += 1;
			if (teamAWon) current.losses += 1;
		}
	}

	return stats;
};

const computePredictionErrors = (X: Matrix, y: Matrix, ratings: number[]) => {
	if (ratings.length === 0 || y.rows === 0) return { rmse: 0, mae: 0 };

	const beta = Matrix.columnVector(ratings);
	const predictions = X.mmul(beta);

	let squaredErrorSum = 0;
	let absoluteErrorSum = 0;

	for (let i = 0; i < y.rows; i += 1) {
		const error = predictions.get(i, 0) - y.get(i, 0);
		squaredErrorSum += error * error;
		absoluteErrorSum += Math.abs(error);
	}

	return {
		rmse: Math.sqrt(squaredErrorSum / y.rows),
		mae: absoluteErrorSum / y.rows,
	};
};

type AnalyticsInput = {
	matches: Match[];
	lambda?: number;
};

export const AnalyticsProgram = ({ matches, lambda = 1 }: AnalyticsInput) =>
	Effect.try({
		try: () => {
			if (lambda <= EPSILON)
				throw new AnalyticsError("lambda must be greater than 0.");

			const participants = collectionParticipants(matches);

			if (participants.length === 0) {
				return {
					participantOrder: [],
					ratings: {},
					ranking: [],
					lambda,
					matchCount: 0,
					rmse: 0,
					mae: 0,
				};
			}

			const { X, y } = buildDesignMatrix(matches, participants);
			const rawRatings = solveRidge(X, y, lambda);
			const centeredRatings = centerRatings(rawRatings);
			const stats = computeMatchStats(matches, participants);
			const errors = computePredictionErrors(X, y, centeredRatings);

			const ranking: ParticipantRating[] = participants.map(
				(participant, index) => {
					if (!stats) return;

					const participantStats = stats.get(participant);

					if (!participantStats)
						throw new AnalyticsError(
							`Unknown participant: ${participant}`,
						);

					return {
						participant,
						rating: centeredRatings[index],
						...participantStats,
					};
				},
			);

			ranking.sort((left, right) => {
				if (right.rating !== left.rating)
					return right.rating - left.rating;

				return left.participant.localeCompare(right.participant);
			});

			const ratings = Object.fromEntries(
				participants.map((participant, index) => [
					participant,
					centeredRatings[index],
				]),
			);

			return {
				participantOrder: participants,
				ratings,
				ranking,
				lambda,
				matchCount: matches.length,
				rmse: errors.rmse,
				mae: errors.mae,
			};
		},
		catch: (cause) =>
			new AnalyticsError("Failed to compute analytics.", cause),
	});
