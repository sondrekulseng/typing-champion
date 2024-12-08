import { TimeLimit } from "@/enums/TimeLimit";

export default class TimeLimitParser {

	static parseToSeconds(timeLimit: TimeLimit): number {
		if (timeLimit === "30 seconds") {
			return 30;
		}
		if (timeLimit === "1 minute") {
			return 60;
		}
		if (timeLimit === "2 minutes") {
			return 120;
		}
		return -1;
	}

	static parseToDbKey(timeLimit: TimeLimit, index: number) {
		return (timeLimit.replace(" ", "-") + "#" + index).toLowerCase();
	}
}
