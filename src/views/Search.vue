<template>
	<div id="search" :style="{bottom:`${offsetBottom}px`}">
		<div class="search-box-wrapper">
			<div class="search-box">
				<i class="iconfont icon-sousuo"></i>
				<input class="box" v-model="keyword" placeholder="搜索歌手 歌曲" @keyup="search">
				<i class="iconfont icon-shanchu" @click="clearInput" v-show="keyword!=''"></i>
			</div>
		</div>
		<div class="hot_key" v-show="panel">
			<h3>热搜</h3>
			<div class="key_word">
				<p v-for="(item,index) in hotList" :key="index" @click="replaceInput(index)">
					{{item.keyword}}
				</p>
			</div>
		</div>
		<div class="songs-list" v-show="!panel" :style="{bottom:`${offsetBottom}px`}">
			<scroll ref='scrollContent' :data="songList" class="scroll-content" :pullup='pullup' @scrollToEnd='loadBottom'>
				<div class="search_list_box">

					<p class="search_list" v-for="(item,index) in songList" @click="playAudio(index)" :key='index'>
						<i class="iconfont icon-bofang"></i> {{item.filename}}
					</p>
					<div class="loading" v-show="isShow">
						<img src="../assets/loading.gif" />
					</div>
				<div class="no-data" v-show='noData'>我也是有底线的</div>
					
				</div>

			</scroll>
		</div>
	</div>
</template>
<script>
	import scroll from '../components/scroll'
	import { PLAY_AUDIO } from '../mixins'
	import { mapGetters } from 'vuex'

	export default {
		mixins: [PLAY_AUDIO],
		data() {
			return {
				keyword: '',
				isShow: true,
				panel: true,
				hotList: [],
				allLoaded: false,
				songList: [],
				pageIndex: 0,
				page: 1,
				noData:false,
				pullup:true
			}
		},
		created() {
			this.getList()
		},
		computed: {
			...mapGetters(['offsetBottom'])
		},
		components: {
			scroll
		},
		methods: {
			clearInput() {
				this.keyword = '';
				this.panel = true
				this.songList = []
			},
			replaceInput(index) {
				this.keyword = this.hotList[index].keyword
				this.search()
			},
			loadBottom() {
				let that = this;
				this.isShow = true
				this.page++
					this.$http.get(`/aproxy/api/v3/search/song?format=json&keyword=${this.keyword}&page=${this.page}&pagesize=30&showtype=1`).then(({
						data
					}) => {
						if(data.data.info.length == 0) {
							this.isShow = false
							
							this.noData = true
							this.pullup = false
							return false
						}else{
							this.songList = this.songList.concat(data.data.info)
							
						}



					})
			},
			getList() {
				this.$http.get('/aproxy/api/v3/search/hot?format=json&plat=0&count=30').then(({
					data
				}) => {
					this.hotList = data.data.info
				});
			},
			search() {
				this.panel = false

				if(this.keyword)
					this.$http.get(`/aproxy/api/v3/search/song?format=json&keyword=${this.keyword}&page=${this.page}&pagesize=30&showtype=1`).then(({
						data
					}) => {
						this.isShow = false
						this.songList = data.data.info
					})

			}
		}

	}
</script>
<style scoped="scoped">
	.no-data{
		color: hsla(0, 0%, 100%, .3);
		text-align: center;
		padding-bottom: 10px;
	}
	#search {
		position: fixed;
		bottom: 0;
		overflow: hidden;
		top: 90px;
		left: 0;
		right: 0;
		overflow: hidden;
	}
	
	.search-box-wrapper {
		margin: 20px;
	}
	
	.search-box {
		display: flex;
		align-items: center;
		box-sizing: border-box;
		width: 100%;
		padding: 0 6px;
		height: 40px;
		background: #333;
		border-radius: 6px;
	}
	
	.scroll-content {
		height: 100%;
		overflow: hidden;
	}
	
	.search_list {
		padding-bottom: 16px;
		color: hsla(0, 0%, 100%, .3);
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	
	.search_list i {
		font-size: 18px;
		padding-right: 10px;
	}
	
	.search-box .box {
		flex: 1;
		margin: 0 5px;
		line-height: 18px;
		background: #333;
		color: #fff;
		font-size: 14px;
		outline: 0;
		border: 0;
	}
	
	.search-box i {
		font-size: 20px;
		color: hsla(0, 0%, 100%, .3);
	}
	
	.hot_key {
		padding: 0 20px;
	}
	
	.hot_key h3 {
		color: #666;
		font-size: 16px;
		font-weight: normal;
	}
	
	.key_word {
		margin-top: 10px;
	}
	
	.key_word p {
		display: inline-block;
		padding: 5px 10px;
		margin: 10px 20px 0 0;
		border-radius: 6px;
		background: #333;
		font-size: 14px;
		color: hsla(0, 0%, 100%, .3);
	}
	
	.search_list_box {
		padding: 0 30px;
	}
	
	.search_list_box .loading {
		width: 100%;
		text-align: center;
		padding-bottom: 10px;
	}
	
	.search_list_box .loading img {
		width: 20px;
		height: 20px;
	}
	
	.songs-list {
		position: fixed;
		top: 170px;
		bottom: 0px;
		width: 100%;
	}
</style>