import { User } from "../types";
import { GUN } from "./index";
import { USER_KEY } from "./keys";

export function createUser(userName: string, Password: string) {
	GUN.get(USER_KEY);
}

export function getUser(userName: string, password: string) {
	return new Promise((res, rej) => {
		GUN.get(USER_KEY)
			.map()
			.once<User>((data, key) => {
				if (data.useName === userName && data.password === password) {
					res(data);
				}
			});
	});
}
