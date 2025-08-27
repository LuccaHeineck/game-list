// src/config/statuses.ts
import { GlobeAmericasIcon, FlagIcon, RocketLaunchIcon, SparklesIcon, HandRaisedIcon, PowerIcon } from "@heroicons/react/24/outline";
export type StatusConfig = {
	name: string;
	color: string;
	icon: React.ComponentType<{ className?: string }>;
};

export const STATUSES: Record<number, StatusConfig> = {
	0: {
		name: "All",
		color: "bg-white",
		icon: GlobeAmericasIcon,
	},
	1: {
		name: "Finished",
		color: "bg-[#6AD7D6]",
		icon: FlagIcon,
	},
	2: {
		name: "Playing",
		color: "bg-[#2DDD6A]",
		icon: RocketLaunchIcon,
	},
	3: {
		name: "Dropped",
		color: "bg-[#E94079]",
		icon: PowerIcon,
	},
	4: {
		name: "Want",
		color: "bg-[#BA29E0]",
		icon: SparklesIcon,
	},
	5: {
		name: "On-hold",
		color: "bg-yellow-500",
		icon: HandRaisedIcon,
	},
};
