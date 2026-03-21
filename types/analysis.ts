export type ParticipantRating = {
	participant: string;
	rating: number;
	matchesPlayed: number;
	wins: number;
	losses: number;
	pointDifferential: number;
};

export type AnalysisResults = {
	participantOrder: string[];
	ratings: Record<string, number>;
	ranking: ParticipantRating[];
	lambda: number;
	matchCount: number;
	rmse: number;
	mae: number;
};
