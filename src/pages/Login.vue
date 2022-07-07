<template>
	<div>
		<div>
			<div>Enter User Name</div>
			<input type="text" placeholder="Name" @input="(e:any) => (userName = e.target.value)" :value="userNameSmall" />
		</div>
		<div>
			<div>Enter Password</div>
			<input
				:type="isPasswordVisible ? 'password' : 'text'"
				placeholder="Password"
				@input="(e:any) => (password = e.target.value)"
				:value="passwordSmall"
			/>

			<button @click="togglePasswordVisibility">show password</button>
		</div>

		<div>
			<button @click="login">Login</button>
			<button @click="createAccount">Create Account</button>
		</div>

		<div v-if="isLoading">loading...</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted, computed } from "vue";
	import { createUser, getUser } from "../db/auth";
	import { GUN } from "../db/index";
	import { setCurrentUser } from "../utils/auth";

	const isPasswordVisible = ref(true);
	const togglePasswordVisibility = () => (isPasswordVisible.value = !isPasswordVisible.value);

	const userName = ref("");
	const password = ref("");

	const isLoading = ref(false);

	const userNameSmall = computed(() => userName.value.toLocaleLowerCase());
	const passwordSmall = computed(() => password.value.toLocaleLowerCase());

	async function login() {
		isLoading.value = true;
		const userPromise = await getUser(userName.value.toLocaleLowerCase(), password.value.toLocaleLowerCase());
		isLoading.value = false;

		if (userPromise == null) {
			alert(`User ${userName.value} does not exist`);
			return;
		}

		alert(`User ${userName.value} logged in`);

		setCurrentUser(userPromise);
	}
	async function createAccount() {
		try {
			isLoading.value = true;
			const user = await createUser(userName.value.toLocaleLowerCase(), password.value.toLocaleLowerCase());

			alert(`new use is created with name ${user.userName.toLocaleLowerCase()}`);

			setCurrentUser(user);
		} catch (error) {
			alert(error);
		} finally {
			isLoading.value = false;
		}
	}
</script>

<style scoped></style>
