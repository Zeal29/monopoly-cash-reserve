<script setup lang="ts">
	import { onMounted, ref } from "vue";
	import { GUN } from "../db";
	import { GAMES_LIST_KEY } from "../db/keys";
	import { router } from "../router/router";
	import { Log } from "../types";
	import { Player } from "../types/index";
	import { getUser } from "../db/auth";
	import { getCurrentUser } from "../utils/auth";
	import { getPlayer, UID } from "../utils/index";
	import { randomUUID } from "crypto";
	import { computed } from "@vue/reactivity";

	const currentTab = ref(null);

	const gameName = ref("");
	const logs = ref(new Map<string, Log>());

	const orderedLogs = computed(() => {
		const arr = Array.from(logs.value.values());
		arr.sort((a, b) => {
			return a.createdAt > b.createdAt ? -1 : 1;
		});
		return arr.map((log, index) => {
			return { ...log, formatedDate: new Date(log.createdAt).toLocaleString(), index };
		});
	});

	const players = ref(new Map<string, Player>());

	const cuurrentUser = ref(getCurrentUser());

	const currentPlayer = ref<Player | null>(null);

	const amountGoingToBeTransfer = ref(0);

	const canBankrupt = computed(() => {
		if (currentPlayer.value == null) return false;

		return currentPlayer.value.money <= 0;
	});

	onMounted(() => {
		console.log("Hello World");
		const currentGameId = router.currentRoute.value.params.id as string;
		const user = getCurrentUser();

		if (user == null) {
			alert("there is some thing wrong");
			return;
		}

		const currentUser = user;

		GUN.get(GAMES_LIST_KEY)
			.get(currentGameId)
			.once((data, key) => {
				console.log(data, key, "ON Mount");

				gameName.value = data.name;
			});

		GUN.get(GAMES_LIST_KEY)
			.get(currentGameId)
			.get("logs")
			.map()
			.on((data, key) => {
				console.log(data, key, "ON Mount Logs");

				logs.value.set(key, data);
			});

		GUN.get(GAMES_LIST_KEY)
			.get(currentGameId)
			.get("players")
			.map()
			.on((data, key) => {
				console.log(data, key, "ON Mount players");

				players.value.set(key, data);
			});

		GUN.get(GAMES_LIST_KEY)
			.get(currentGameId)
			.get("players")
			.get("bank")
			.once((data, key) => {
				console.log(data, key, "ON Mount players > bank");

				if (data == null) {
					if (currentUser == null) {
						alert("there is some thing wrong");
						return;
					}

					const bank: Player = {
						userId: "bank",
						name: "Bank",
						money: 100_000_000,
						isBankrupt: false,
					};

					GUN.get(GAMES_LIST_KEY).get(currentGameId).get("players").get("bank").put(bank);
				}
			});

		GUN.get(GAMES_LIST_KEY)
			.get(currentGameId)
			.get("players")
			.get(currentUser.userId)
			.once((data, key) => {
				console.log(data, key, "ON Mount players > bank");

				if (data == null) {
					const player: Player = {
						userId: currentUser?.userId,
						name: currentUser.userName,
						money: 1500,
						isBankrupt: false,
					};
					GUN.get(GAMES_LIST_KEY).get(currentGameId).get("players").get(player.userId).put(player);
				}
			});

		GUN.get(GAMES_LIST_KEY)
			.get(currentGameId)
			.get("players")
			.get(currentUser.userId)
			.on((data, key) => {
				console.log(data, key, "ON Mount players > bank");

				if (data == null) {
					return;
				}

				currentPlayer.value = data;
			});
	});

	async function sendMoney(fromPlayerId: string, toPlayerId: string, type: Log["logType"] = "amountTransfer") {
		if (cuurrentUser.value == null) {
			alert("there is some thing wrong");
			return;
		}

		const currentGameId = router.currentRoute.value.params.id as string;

		const fromPlayer = await getPlayer(currentGameId, fromPlayerId);
		const toPlayer = await getPlayer(currentGameId, toPlayerId);

		if (fromPlayer == null || toPlayer == null) {
			alert("there is some thing wrong");
			return;
		}

		if (fromPlayer.money < amountGoingToBeTransfer.value) {
			alert("Not enough money");
			return;
		}

		const fromPlayerMoney = fromPlayer.money - amountGoingToBeTransfer.value;
		const toPlayerMoney = toPlayer.money + amountGoingToBeTransfer.value;

		GUN.get(GAMES_LIST_KEY).get(currentGameId).get("players").get(fromPlayerId).put({ money: fromPlayerMoney });
		GUN.get(GAMES_LIST_KEY).get(currentGameId).get("players").get(toPlayerId).put({ money: toPlayerMoney });

		const log: Log = {
			userId: cuurrentUser.value?.userId,
			message: `${fromPlayer.name} has sent $${amountGoingToBeTransfer.value} to ${toPlayer.name}`,
			createdAt: Date.now(),
			logId: UID(),
			logType: type,
		};

		GUN.get(GAMES_LIST_KEY).get(currentGameId).get("logs").set(log);
		amountGoingToBeTransfer.value = 0;
	}

	function getBankrupt() {
		const currentGameId = router.currentRoute.value.params.id as string;
		if (cuurrentUser.value == null || currentPlayer.value == null) {
			alert("there is some thing wrong");
			return;
		}

		if (currentPlayer.value.money > 0) {
			alert("you can't get bankrupt before 0 money");
		}

		const partialPalyer: Partial<Player> = {
			isBankrupt: true,
		};
		GUN.get(GAMES_LIST_KEY).get(currentGameId).get("players").get(cuurrentUser.value.userId).put(partialPalyer);

		const log: Log = {
			userId: cuurrentUser.value?.userId,
			message: `${currentPlayer.value.name} has decleared bankruptcy`,
			createdAt: Date.now(),
			logId: UID(),
			logType: "bankruptcy",
		};

		GUN.get(GAMES_LIST_KEY).get(currentGameId).get("logs").set(log);

		alert("you are bankrupt 😭");
	}
</script>

<template>
	<v-col cols="12" sm="6" class="mx-auto">
		<div>
			<h2>Game Name: {{ gameName }}</h2>
			<v-divider />

			<h2>Money: {{ currentPlayer?.money }}</h2>
			<h3>Name: {{ currentPlayer?.name }}</h3>
			<h3 :style="`color: ${currentPlayer?.isBankrupt ? 'red' : ''}`">isBankrupt: {{ currentPlayer?.isBankrupt ? "Yes" : "No" }}</h3>

			<v-divider />

			<h1 class="mt-5">Logs</h1>
			<ul class="logsStyles">
				<v-list-item v-for="log in orderedLogs" :key="log.index">
					<v-list-item-content
						class="mx-auto"
						:style="`color: ${log.logType === 'bankruptcy' ? 'red' : log.logType === 'bankReceive' ? 'green' : ''}`"
					>
						<v-list-item-title>{{ log.index }}. {{ log.message }}</v-list-item-title>
						<v-list-item-subtitle>Created At: {{ log.formatedDate }}</v-list-item-subtitle>
					</v-list-item-content>
				</v-list-item>
			</ul>

			<v-divider />

			<h1 class="mt-5">Players</h1>

			<input />

			<v-text-field class="mt-3" label="Money" type="number" v-model="amountGoingToBeTransfer" placeholder="Search"></v-text-field>

			<ul>
				<template v-for="[key, player] in players" :key="key">
					<v-list-item v-if="cuurrentUser?.userId !== player.userId">
						<v-list-item-content class="mx-auto" :style="`color: ${player.isBankrupt ? 'red' : ''}`">
							<v-list-item-title>{{ player.name ?? "NO Name" }}</v-list-item-title>
							<!-- <v-list-item-subtitle>Money: {{ player.money }}</v-list-item-subtitle> -->
							<v-btn :disabled="player.isBankrupt" @click="sendMoney(cuurrentUser?.userId as string, player.userId)"
								>Transfer Money</v-btn
							>
						</v-list-item-content>
					</v-list-item>
					<v-divider />
				</template>
			</ul>

			<v-btn class="mx-auto" @click="getBankrupt" :disabled="!canBankrupt">Get Bankrupt</v-btn>

			<v-divider />

			<h1>Take from bank</h1>

			<v-btn class="mx-auto" :disabled="currentPlayer?.isBankrupt" @click="sendMoney('bank', currentPlayer?.userId as string,'bankReceive')"
				>Get Money Form Bank</v-btn
			>
		</div>
	</v-col>
</template>

<style scoped>
	.logsStyles {
		height: 400px;
		overflow: auto;
	}
</style>
