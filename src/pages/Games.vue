<script setup lang="ts">
	import { computed } from "@vue/reactivity";
	import { debug } from "console";
	import { onMounted, ref } from "vue";
	import { GUN } from "../db";
	import { GAMES_LIST_KEY, ROOT_KEY } from "../db/keys";
	import { Game } from "../types";
	import { UID } from "../utils";

	const games = ref(new Map<string, Game>());

	const orderedGames = computed(() => {
		const arr = Array.from(games.value.values());
		arr.sort((a, b) => {
			return new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1;
		});
		return arr.map((log, index) => {
			return { ...log, index };
		});
	});

	const newGameName = ref("");

	onMounted(() => {
		GUN.get(GAMES_LIST_KEY)
			.map()
			.on((data, key) => {
				games.value.set(key, { ...data, key });
				console.log(data, key, "ON Mount");
			});
	});

	function submit() {
		debugger;
		GUN.get(ROOT_KEY).once((d) => {
			console.log("hello", d);
		});
		GUN.put(
			{
				[ROOT_KEY]: null,
			},
			(d) => console.log("done", d),
		);

		if (newGameName.value.trim() === "") {
			alert("please entet some game name");
			return;
		}

		const game: Game = {
			logs: {},
			name: newGameName.value,
			players: {},
			createdAt: new Date().toLocaleString(),
			key: UID(),
		};

		GUN.get(GAMES_LIST_KEY).put({
			[game.key]: game,
		});
	}
</script>

<template>
	<v-col cols="12" sm="6" class="mx-auto">
		<h1>Games</h1>
		<v-text-field class="mt-3" label="Game Name" placeholder="Sunday Night With Ali" v-model="newGameName"></v-text-field>

		<v-btn class="mx-auto" @click="submit">Create Game</v-btn>

		<v-divider class="my-6" />
		<div>
			<v-card class="mx-auto" tile>
				<v-list-item three-line v-for="game in orderedGames" :key="game.index" :to="{ path: `/game/${game.key}` }">
					<!-- <v-card elevation="2" shaped tile> -->
					<v-list-item-content>
						<v-list-item-title class="text-left">Name: {{ game.name }}</v-list-item-title>
						<v-list-item-subtitle>Created At: {{ game.createdAt }}</v-list-item-subtitle>
					</v-list-item-content>
					<!-- </v-card> -->
				</v-list-item>
			</v-card>
		</div>
	</v-col>
</template>

<style scoped></style>
