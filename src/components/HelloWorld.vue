<script setup lang="ts">
	import { ref, onMounted } from "vue";
	import { GUN } from "../db/index";

	interface MessageObj {
		message: string;
		id: string;
	}

	defineProps<{ msg: string }>();

	const message = ref("");
	const messageList = ref(new Map<string, string>());

	onMounted(() => {
		GUN.get("aliMessages/list")
			.map()
			.on((data, key) => {
				console.log(data, key);
				messageList.value.set(key, data.message);
			});
	});

	function submit() {
		if (message.value.trim() === "") return;

		GUN.get("aliMessages").get("list").set({ message: message.value });
	}

	function show() {
		console.log(GUN.get("aliMessages"));
	}
</script>

<template>
	<p>Hello {{ message }} {{ message.trim() === "" ? "true" : "alse" }}</p>
	<input type="text" placeholder="chat" v-model="message" />
	<button @click="submit" :disabled="message.trim() === ''">Submit</button>
	<button @click="show">Show</button>

	<div>
		<ul>
			<li v-for="[key, value] in messageList" :key="key">{{ value }}</li>
		</ul>
	</div>
</template>

<style scoped>
	a {
		color: #42b983;
	}

	label {
		margin: 0 0.5em;
		font-weight: bold;
	}

	code {
		background-color: #eee;
		padding: 2px 4px;
		border-radius: 4px;
		color: #304455;
	}
</style>
