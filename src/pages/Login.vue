<template>
	<div>
		<v-col cols="12" sm="6" class="mx-auto">
			<v-text-field label="User Name" placeholder="Ali Nawaz" @input="updateUserName"></v-text-field>
			<v-text-field
				label="Passwors"
				:type="isPasswordVisible ? 'password' : 'text'"
				placeholder="Password"
				:append-inner-icon="isPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'"
				@click:append-inner="togglePasswordVisibility"
				@input="updatePassword"
			></v-text-field>

			<v-btn block :loading="isLoadingLogin" :disabled="isLoadingLogin" color="secondary" @click="login">Login</v-btn>
			<v-btn block class="mt-3" :loading="isLoadingCreateAccount" :disabled="isLoadingCreateAccount" @click="createAccount"
				>Create Account</v-btn
			>
		</v-col>
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted, computed } from "vue";
	import { createUser, getUser } from "../db/auth";
	import { GUN } from "../db/index";
	import { router } from "../router/router";
	import { setCurrentUser } from "../utils/auth";

	const isPasswordVisible = ref(true);
	const togglePasswordVisibility = () => (isPasswordVisible.value = !isPasswordVisible.value);

	const userName = ref("");
	const password = ref("");

	const updateUserName = (e: any) => (userName.value = e.target.value.trim().toLocaleLowerCase());
	const updatePassword = (e: any) => (password.value = e.target.value.trim().toLocaleLowerCase());

	const isLoadingLogin = ref(false);
	const isLoadingCreateAccount = ref(false);

	// const isNoInput = computed(() => userName.value.trim() === "" && password.value.trim() === "");

	async function login() {
		isLoadingLogin.value = true;
		const userPromise = await getUser(userName.value, password.value);
		isLoadingLogin.value = false;

		if (userPromise == null) {
			alert(`User ${userName.value} does not exist`);
			return;
		}

		alert(`User ${userName.value} logged in`);

		setCurrentUser(userPromise);

		router.push("/");
	}
	async function createAccount() {
		try {
			isLoadingCreateAccount.value = true;
			const user = await createUser(userName.value, password.value);

			alert(`new use is created with name ${userName.value}`);

			setCurrentUser(user);
		} catch (error) {
			alert(error);
		} finally {
			isLoadingCreateAccount.value = false;
		}
	}
</script>

<style scoped>
	.p-40px {
		padding-right: 40px;
	}

	.width {
		width: 300px;
	}
</style>
