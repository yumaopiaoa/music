<template>
	<transition name='slide'>
		<div class="music-list">
			<musicList :title='title' :bgImage="imgurl" :songList="songList" :rank='true'></musicList>
		</div>
	</transition>
</template>

<script>
	import musicList from '../components/musicList'
	import { PLAY_AUDIO } from '../mixins'
	export default {
		mixins: [PLAY_AUDIO],
		data() {
			return {
				title: '',
				songList: [],
				imgurl: ''
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
				this.$http.get(`/proxy/rank/info/?rankid=${infoID}&page=1&json=true`).then(({data}) => {
					console.log(data)
					const {info, songs} = data
					const {banner7url, rankname} = info
					const {list} = songs
					
					this.title = rankname
					this.imgurl = banner7url.replace('{size}', '400')
					this.songList = list
				})
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