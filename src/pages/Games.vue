<script setup lang="ts">
	import { onMounted, ref } from "vue";
	import { GUN } from "../db";
	import { GAMES_LIST_KEY } from "../db/keys";
	import { Game } from "../types";

	const games = ref(new Map<string, Game>());
	const newGameName = ref("");

	onMounted(() => {
		GUN.get(GAMES_LIST_KEY)
			.map()
			.on((data, key) => {
				games.value.set(key, data);
				console.log(data, key, "ON Mount");
			});
	});

	function submit() {
		if (newGameName.value.trim() === "") return;

		const game: Game = {
			logs: {},
			name: newGameName.value,
			players: {},
			createdAt: new Date().toLocaleString(),
		};

		GUN.get(GAMES_LIST_KEY).set(game);
	}
</script>

<template>
	<h1>Games</h1>
	<input type="text" placeholder="game name" v-model="newGameName" />
	<v-btn class="mx-auto" @click="submit">Create Game</v-btn>
	<div>
		<v-list-item v-for="[key, value] in games" :key="key" :to="{ path: `/game/${key}` }">
			<v-list-item-content class="mx-auto">
				<v-list-item-title>{{ value.name }}</v-list-item-title>
				<v-list-item-subtitle>Created At: {{ value.createdAt }}</v-list-item-subtitle>
			</v-list-item-content>
		</v-list-item>
	</div>
</template>

<style scoped></style>
