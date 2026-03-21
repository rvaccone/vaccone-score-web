import { create } from "zustand";
import { persist } from "zustand/middleware";

type ParticipantStore = {
	participants: string[];

	addParticipant: (name: string) => void;
	removeParticipant: (name: string) => void;
	resetParticipants: () => void;
};

export const useParticipantStore = create<ParticipantStore>()(
	persist(
		(set, get) => ({
			participants: [],

			addParticipant: (name) => {
				const { participants } = get();

				// Check if the participant already exists
				if (participants.includes(name)) return;

				set((state) => ({
					participants: [...state.participants, name],
				}));
			},
			removeParticipant: (name) => {
				set((state) => ({
					participants: state.participants.filter(
						(participant) => participant !== name,
					),
				}));
			},
			resetParticipants: () => {
				set({ participants: [] });
			},
		}),
		{ name: "participants-storage" },
	),
);
