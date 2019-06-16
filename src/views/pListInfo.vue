<template>
	<transition name='slide'>
		<div id="p-list-info" class="music-list">
			<musicList :title='title' :bgImage="imgUrl" :songList="songList"></musicList>

		</div>
	</transition>
</template>

<script>
	import musicList from '../components/musicList'

	export default {
		data() {
			return {
				title: '',
				songList: [],
				imgUrl: ''
			}
		},
		mounted() {
			this.getList()
		},
		components: {
			musicList
		},
		methods: {
			getList() {
				var infoID = this.$route.params.id
				this.$http.get(`/proxy/plist/list/${infoID}?json=true`).then(({
					data
				}) => {
					const info = data.info.list
					const list = data.list.list.info
					this.songList = list
					this.imgUrl = info.imgurl.replace('{size}', '400')
					this.title = info.intro
				});
			}
		}

	}
</script>

<style scoped="scoped">
	.slide-enter-active,
	.slide-leave-active {
		transition: all 0.3s
	}
	
	.slide-enter,
	.slide-leave-to {
		transform: translate3d(100%, 0, 0)
	}
</style>