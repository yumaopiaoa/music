import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		audio: {
			songUrl: '',
			imgUrl: '',
			title: '',
			singer: '',
			lrc: ''
		},
		isShowPlayer: false,
		isShowMiniPlayer: false,
		listInfo: {
			songList: [],
			songIndex: 0
		},
		offsetBottom:0
	},
	getters: {
		audio: state => state.audio,
		isShowMiniPlayer: state => state.isShowMiniPlayer,
		isShowPlayer: state => state.isShowPlayer,
		offsetBottom:state => state.offsetBottom
	},
	mutations: {
			
		showNormalPlayer: (state, flag) => {
			state.isShowPlayer = flag
		},
		showMiniPlayer: (state, flag) => {
			state.isShowMiniPlayer = flag
		},
		setAudio: (state, audio) => {
			state.audio = { ...(state.audio),
				...audio
			}

		},
		setListInfo: (state, {
			list,
			index
		}) => {
			state.listInfo.songList = list
			state.listInfo.songIndex = index
		},
		offsetBottom:(state,offsetbottom)=>{
			state.offsetBottom = offsetbottom
		
		}
	},
	actions: {
		getSong({
			commit,
			state
		}, hash) {
			axios.get(`/bproxy/yy/index.php?r=play/getdata&hash=${hash}&album_id=20803260&dfid=2SFDEU0LE0il0C8wTB4d44Km&mid=8a0c9777880756cfe46f68f6cb3f13e4&platid=4&_=1558185587071`).then(({
				data
			}) => {
				console.log(data)
				
				const imgUrl = data.data.img
				const songUrl = data.data.play_url

				const title = data.data.audio_name
				const singer = data.data.author_name
				const lrc = data.data.lyrics

				const audio = {
					songUrl,
					imgUrl,
					title,
					singer,
					lrc
				}
				commit('setAudio', audio)
			})
		},
		next({
			dispatch,
			state
		}) {
			var list = state.listInfo.songList
			if(state.listInfo.songIndex == list.length - 1) {
				state.listInfo.songIndex = 0
			} else {
				++state.listInfo.songIndex
			}
			var hash = list[state.listInfo.songIndex].hash
			dispatch('getSong', hash)
		},
		prev({
			dispatch,
			state
		}) {
			var list = state.listInfo.songList
			if(state.listInfo.songIndex == 0) {
				state.listInfo.songIndex = list.length
			} else {
				state.listInfo.songIndex--
			}
			var hash = list[state.listInfo.songIndex].hash
			dispatch('getSong', hash)
		}
	}
})

export default store