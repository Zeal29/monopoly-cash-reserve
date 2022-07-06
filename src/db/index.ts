import Gun from "gun";

export const GUN = new Gun([window.origin + "/gun", "https://gun-manhattan.herokuapp.com/gun"]);

//@ts-ignore
window.gun = GUN;
