import ky from "ky";

export const api = ky.create({
	prefixUrl: process.env.NEXT_PUBLIC_ANALYSIS_API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});
