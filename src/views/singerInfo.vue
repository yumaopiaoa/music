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
				this.$http.get(`/proxy/singer/info/${infoID}&json=true`).then(({
					data
				}) => {
//					console.log(data)
					const info = data.info
					const songList = data.songs.list
					this.title = info.singername

					this.imgUrl = info.imgurl.replace('{size}', '400')
					this.songList = songList
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