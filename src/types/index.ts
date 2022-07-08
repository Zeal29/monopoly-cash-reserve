export interface User {
	userName: string;
	password: string;
	userId: string;
	createdAt: string;
}

export type Log = {
	logId: string;
	userId: string;
	createdAt: number;
	logType: "amountTransfer" | "bankruptcy" | "bankReceive";
	message: string;
};

export type Player = {
	userId: string;
	name: string;
	money: number;
	isBankrupt: boolean;
};

export type Games = Record<string, Game>;

export type Game = {
	name: string;
	logs: Record<string, Log>;
	players: Record<string, Player>;
	createdAt: string;
};
