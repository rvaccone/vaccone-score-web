import { create } from "zustand";
import { persist } from "zustand/middleware";

type MatchesStore = {
	matches: Match[];

	addMatch: (match: Match) => void;
	removeMatch: (id: string) => void;
	resetMatches: () => void;
};

export const useMatchesStore = create<MatchesStore>()(
	persist(
		(set) => ({
			matches: [],

			addMatch: (match) => {
				set((state) => ({
					matches: [...state.matches, match],
				}));
			},
			removeMatch: (id) => {
				set((state) => ({
					matches: state.matches.filter((match) => match.id !== id),
				}));
			},
			resetMatches: () => {
				set({ matches: [] });
			},
		}),
		{ name: "matches-storage" },
	),
);
