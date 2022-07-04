<template>
	<div>
		<div>
			<lable>Eneter User Name</lable>
			<input type="text" placeholder="Name" />
		</div>
		<div>
			<lable>Eneter Password</lable>
			<input type="text" placeholder="Password" />
		</div>

		<div>
			<button @click="login">Login</button>
			<button @click="createAccount">Create Account</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted } from "vue";
	import { GUN } from "../db/index";

	const userName = ref("");
	const password = ref("");

	function login() {}
	function createAccount() {}
</script>

<style scoped></style>
