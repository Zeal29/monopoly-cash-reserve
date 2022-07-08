<script setup lang="ts">
	import { ref } from "vue";
	import { router } from "./router/router";
	import { logout } from "./utils/auth";

	let drawer = ref(false);

	function logoutHandler() {
		logout();
		router.push("/login");
	}

	console.log(router.currentRoute.value, "hello");
</script>

<template>
	<v-app>
		<v-app-bar elevation="4" @click="drawer = !drawer">
			<v-app-bar-nav-icon></v-app-bar-nav-icon>
			<v-toolbar-title>Monopoly Cash Reserve </v-toolbar-title>
			<!-- <router-link to="/">Home</router-link>
			<router-link to="/about">About</router-link> -->
		</v-app-bar>

		<v-navigation-drawer v-model="drawer">
			<v-list dense nav v-if="router.currentRoute.value.path !== '/login'">
				<v-list-item link to="/">
					<v-list-item-content>
						<v-list-item-title>Home</v-list-item-title>
					</v-list-item-content>
				</v-list-item>

				<!-- <v-list-item link to="/about">
					<v-list-item-content>
						<v-list-item-title>About</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-spacer /> -->
			</v-list>

			<template v-slot:append>
				<div class="pa-2">
					<v-btn @click="logoutHandler" block> Logout 🚪</v-btn>
				</div>
			</template>
		</v-navigation-drawer>

		<v-main>
			<div>
				<router-view></router-view>
			</div>
		</v-main>
	</v-app>
</template>

<style>
	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: #2c3e50;
		margin-top: 60px;
	}
</style>
