module.exports = {
	'PLAY_AUDIO': {
		methods: {
			playAudio(index) {
				
				if(!this.songList) {
					return
				}
				var offsetbottom = 60
				var hash = this.songList[index].hash
				var info = {
					list: this.songList,
					index: index
				}
				this.$store.commit('offsetBottom',offsetbottom)
				this.$store.commit('setListInfo', info)

				this.$store.dispatch('getSong', hash)

				this.$store.commit("showNormalPlayer", true)
				this.$store.commit("showMiniPlayer", false)

			}
		}
	}
};