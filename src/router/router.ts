import { createRouter, createWebHashHistory } from "vue-router";
import { getCurrentUser } from "../utils/auth";
// 2. Define some routes
// Each route should map to a component.

import GameVue from "../pages/Game.vue";
import GamesVue from "../pages/Games.vue";
import LoginVue from "../pages/Login.vue";

// We'll talk about nested routes later.

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
export const router = createRouter({
	// 4. Provide the history implementation to use. We are using the hash history for simplicity here.
	history: createWebHashHistory(),
	routes: [
		{ path: "/login", component: LoginVue },
		{ path: "/", component: GamesVue },
		{ path: "/:id", component: GameVue },
	], // short for `routes: routes`
});

router.beforeResolve((to, from) => {
	console.log("rout 1");

	if (to.fullPath === "/login") {
		return true;
	}

	if (getCurrentUser() == null) {
		console.log("rout 2");

		router.push("/login");
		console.log("rout 3");
	}

	console.log("rout 4");
});
