
const USER_ID_KEY = "@@USER_ID_KEY_FOR_MONOPOLY@@";

export function getCurrentUserId() {
	return localStorage.getItem(USER_ID_KEY);
}

export function setCurrentUserId(id: string) {
	localStorage.setItem(USER_ID_KEY, id);
}
