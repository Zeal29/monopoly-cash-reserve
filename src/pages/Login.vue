<template>
	<div>
		<div>
			<div>Enter User Name</div>
			<input type="text" placeholder="Name" v-model="userName" />
		</div>
		<div>
			<div>Enter Password</div>
			<input type="text" placeholder="Password" v-model="password" />
		</div>

		<div>
			<button @click="login">Login</button>
			<button @click="createAccount">Create Account</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted } from "vue";
	import { createUser, getUser } from "../db/auth";
	import { GUN } from "../db/index";
	import { setCurrentUser } from "../utils/auth";

	const userName = ref("");
	const password = ref("");

	async function login() {
		const userPromise = getUser(userName.value, password.value);

		const value = await userPromise;

		console.log(value, "resolved user");
	}
	async function createAccount() {
		try {
			const user = await createUser(userName.value, password.value);
			alert(`new use is created with name ${user.userName}`);

			setCurrentUser(user);
		} catch (error) {
			alert(error);
		}
	}
</script>

<style scoped></style>
