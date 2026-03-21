import { create } from "zustand";
import { persist } from "zustand/middleware";

type ConfigStore = {
	participantsPerTeam: number;

	setParticipantsPerTeam: (participantsPerTeam: number) => void;
};

export const useConfigStore = create<ConfigStore>()(
	persist(
		(set) => ({
			participantsPerTeam: 2, // Default

			setParticipantsPerTeam: (participantsPerTeam) => {
				set({ participantsPerTeam });
			},
		}),
		{ name: "config-storage" },
	),
);
