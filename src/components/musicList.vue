<template>
	<div class="music-list" :style="{bottom:`${offsetBottom}px`}">
		<div class="top-bar" ref='topBar'>
			<div class="goBack">
				<div class="back-icon" @click="goBack">
					<i class="iconfont icon-fanhui"></i>
				</div>
				<h1>{{title}}</h1>
			</div>
			<div ref="bgImage" class="bg_img" :style="{backgroundImage:`url(${this.bgImage})`}">
			</div>
		</div>

		<scroll ref='list' :data="songList" @scroll='scroll' :listen-scroll="listenScroll" :probe-type="probeType" class="music_container">

			<ul ref='layer'>


				<li v-for="(item,index) in songList" @click="playAudio(index)">
					<div class="rank" v-show="rank" :class="{'rank-list-good':index<3, 'rank-list-first' : index==0, 'rank-list-second' : index==1, 'rank-list-third' : index==2}">
						{{index+1}}
					</div>
					<div class="list">
						<h3>{{item.filename}}</h3>
						<p>{{item.remark}}</p>
					</div>

				</li>
			</ul>
				<loading v-show="songList.length==0"></loading>
			
		</scroll>

	</div>

</template>

<script>
	import { PLAY_AUDIO } from '../mixins'
	import scroll from './scroll'
	import loading from './loading'
	import { mapGetters } from 'vuex'
	 

	const headHeight = 44
	export default {
		mixins: [PLAY_AUDIO],
		data() {
			return {
				scrollY: 0
			}
		},
		computed: {
			...mapGetters(['offsetBottom']),
			
			scale() {
				let bgImg = this.$refs.bgImg
				let imgHeight = 256
				let percent = Math.abs(this.scrollY / this.imageHeight)
				let scale = 1
				if(this.scrollY > 0) {
					scale = 1 + percent

				}
				return scale
			}
		},
		props: {
			bgImage: {
				type: String,
				default: ''
			},

			title: {
				type: String,
				default: ''
			},
			songList: {
				type: Array,
				default: ''
			},
			rank: {
				type: Boolean,
				default: false
			}
		},
		components: {
			scroll,
			loading
		},
		created() {
			this.listenScroll = true
			this.probeType = 3

		},
		mounted() {
			this.imageHeight = this.$refs.bgImage.clientHeight
			this.minTransalteY = -this.imageHeight + headHeight
			this.$refs.list.$el.style.top = `${this.imageHeight}px`
		},
		methods: {
			goBack() {
				this.$router.back(); //根据浏览器记录返回上一层
			},

			scroll(pos) {
				this.scrollY = pos.y
			}
		},
		watch: {
			scrollY(newVal) {
				let translateY = Math.max(this.minTransalteY, newVal)
				let scale = 1
				const percent = Math.abs(newVal / this.imageHeight)
				if(newVal > 0) {
					scale = 1 + percent
				}
				if(newVal < this.minTransalteY) {


					this.$refs.bgImage.style.height = `${headHeight}px`
					this.$refs.bgImage.style.zIndex = 1
					

				} else {
					this.$refs.bgImage.style.zIndex = -1

					this.$refs.bgImage.style.height = ""

				}

				this.$refs.bgImage.style.transform = `scale(${scale})`
			}
		}
	}
</script>

<style scoped="scoped">
	.music-list {
		position: fixed;
		z-index: 100;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background: #222;
	}
	
	.top-bar {
		width: 100%;
		height: 44px;
		z-index: 999;
	}
	
	.top-bar .goBack .back-icon {
		position: absolute;
		top: 0;
		left: 6px;
		z-index: 50;
	}
	
	.top-bar .goBack .back-icon .icon-fanhui {
		display: block;
		padding: 10px;
		font-size: 22px;
		color: #ffcd32;
	}
	
	.top-bar .goBack h1 {
		position: absolute;
		top: 0;
		left: 10%;
		z-index: 40;
		width: 80%;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		text-align: center;
		line-height: 40px;
		font-size: 18px;
		color: #fff;
		font-weight: 400;
	}
	
	.bg_img {
		width: 100%;
		height: 256px;
		overflow: hidden;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: -1;
		
		background-size: 100%;
	}
	

	
	.music_container {
		top: 256px;
		position: absolute;
		width: 100%;
		left: 0;
		bottom: 0;
	}
	
	.music_container ul {
		padding: 20px 30px;
		background: #222;
		top: 50px;
	}
	
	.music_container ul li {
		height: 64px;
		display: flex;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	
	.music_container ul li .rank {
		color: #ffcd32;
		font-size: 18px;
		flex: 0 0 25px;
		width: 25px;
		margin-right: 30px;
		text-align: center;
	}
	.music_container ul li .list{
		width: 100%;
		overflow: hidden;
	}
	.music_container ul li h3 {
		color: #fff;
		font-weight: 400;
		text-overflow: ellipsis;
		font-size: 15px;
		margin-bottom: 5px;
		white-space: nowrap;
		overflow: hidden;
	}
	
	.music_container ul li p {
		color: #aaa;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	
	.rank-list-good {
		color: #fff !important;
		border-radius: 10px;
		height: 25px;
		line-height: 25px;
	}
	
	.rank-list-third {
		background: #f8b300;
	}
	
	.rank-list-second {
		background: #ff7200;
	}
	
	.rank-list-first {
		background: red;
	}
</style>