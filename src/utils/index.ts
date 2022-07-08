import { Player } from "../types";
import { GUN } from "../db/index";
import { GAMES_LIST_KEY } from "../db/keys";

export function UID() {
	return Date.now() + "-" + Math.random();
}

export function getPlayer(gameId: string, userId: string): Promise<Player | null> {
	return new Promise((res) => {
		GUN.get(GAMES_LIST_KEY)
			.get(gameId)
			.get("players")
			.get(userId)
			.once((data, key) => {
				console.log(data, key, "call the getPlayer");

				res(data);
			});
	});
}
