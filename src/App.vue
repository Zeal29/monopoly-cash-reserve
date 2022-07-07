<script setup lang="ts"></script>

<template>
	<v-app>
		<v-main>
			<div>
				<header>
					<router-link to="/">Go to Home</router-link>
					<router-link to="/about">Go to About</router-link>
				</header>

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
		text-align: center;
		color: #2c3e50;
		margin-top: 60px;
	}
</style>
