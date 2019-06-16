<template>
	<div id="app">
		<Header/>

		<keep-alive>
			<router-view v-if="$route.meta.keepAlive"></router-view>
		</keep-alive>

		<router-view v-if="!$route.meta.keepAlive"></router-view>
		<Player/>
	</div>
</template>

<script>
	import Header from './components/header/head.vue'
	import Player from './components/play/play'
	export default {
		name: 'App',
		components: {
			Header,
			Player
		},
		
		methods: {
			
		}
	}
</script>

<style scoped="scoped">
	
</style>