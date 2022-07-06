import { User } from "../types";
import { UID } from "../utils";
import { GUN } from "./index";
import { USER_KEY } from "./keys";

export function getUserKey(userName: string, password: string) {
	return `${userName}|-|${password}`;
}

export async function createUser(userName: string, password: string) {
	const user = await getUser(userName, password);

	if (user != null) {
		throw new Error("User Already Exist");
	}

	const newUser: User = {
		userName,
		password,
		createdAt: new Date().toUTCString(),
		userId: UID(),
	};

	GUN.get(USER_KEY).get(getUserKey(userName, password)).put(newUser);

	return newUser;
}

export function getUser(userName: string, password: string): Promise<User | null> {
	return new Promise((res, rej) => {
		GUN.get(USER_KEY)
			.get(getUserKey(userName, password))
			.once((data) => res(data));
	});
}
