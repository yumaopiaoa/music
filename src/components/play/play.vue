<template>

	<div class="player">
		<transition name="normal-animate">
			<div class="normal-player" v-show="isShowPlayer">
				<div class="detail_player" :style="{backgroundImage:`url(${audio.imgUrl})`}"></div>
				<div class="top">
					<div class="back" @click="showMiniPlayer()">
						<i class="iconfont icon-fanhui"></i>
					</div>
					<h1>{{audio.title}}</h1>
					<h2>{{audio.singer}}</h2>
				</div>
				<div class="middle" @touchstart.prevent="middleTouchStart" @touchmove.prevent="middleTouchMove" @touchend="middleTouchEnd">
					<div class="left" ref='left'>
						<div class="cd-wrapper">
							<div class="cd">
								<img :src="audio.imgUrl" :class="isPlay?`cd-play`:`cd-play cd-pause`" />
							</div>
						</div>

						<div class="mini-lrc">
							<div class="lrc-content" :style="{marginTop: lrcOffset + 'px' }">
								<p v-for="(item,index) in songLrc" :class="{isCurrentLrc:item.seconds >= currentTime}">
									{{item.lrcContent}}
								</p>
							</div>
						</div>
					</div>

					<div class="right" ref="right">
						<scroll :data="songLrc" class="big-lrc" ref="lyricList">
							<div class="lrc-content">
								<p ref="lyricLine" v-for="(item,index) in songLrc" :class="{current:index==lineNum}">
									{{item.lrcContent}}
								</p>
							</div>
						</scroll>
					</div>
				</div>
				<div class="bottom">
					<div class="dot-wrapper">
						<span class="dot" :class="{'active':currentShow==='cd'}"></span>
						<span class="dot" :class="{'active':currentShow==='lyric'}"></span>
					</div>
					<div class="progress">
						<span>{{currentTime | time}}</span>
						<div class="progress_bar_warpper">
							<div class="progress_bar">
								<div class="bar_len" @click="progressGo">
									<div class="dot" :style="{left:broadcastPace+'px'}"></div>
									<div class="now" :style="{width:broadcastPace+'px'}"></div>
								</div>

							</div>
						</div>
						<span>{{songTime | time}}</span>
					</div>
					<div class="controls">
						<div class="prev">
							<i class="iconfont icon-diyiyeshouyeshangyishou" @click="prev()"></i>
						</div>
						<div class="play">
							<i class="iconfont" :class="playIcon" @click="toggleStatus()"></i>
						</div>
						<div class="next">
							<i class="iconfont icon-zuihouyiyemoyexiayishou" @click="next()"></i>
						</div>
					</div>
					<audio ref="audio" :src="audio.songUrl" autoplay="autoplay" @timeupdate="timeUpdate" @error="next" @ended="next">
					</audio>
				</div>
			</div>
		</transition>
		<transition name="mini-animate">
			<div class="mini-player" v-show="isShowMiniPlayer" @click="showNormalPlayer()">
				<div class="icon" :style="{backgroundImage:`url(${audio.imgUrl})`}"></div>
				<div class="text">
					<h3>{{audio.title}}</h3>
					<p>{{audio.singer}}</p>
				</div>
				<div class="control">
					<i class="iconfont" :class="playIcon" @click.stop="toggleStatus()"></i>

					<i class="iconfont icon-zuihouyiyemoyexiayishou" @click.stop="next()"></i>
				</div>
			</div>
		</transition>

	</div>

</template>

<script>
	import { mapGetters } from 'vuex'
	import scroll from '../scroll.vue'

	export default {
		name: 'play',
		data() {
			return {
				currentShow: 'cd',
				currentTime: 0,
				songTime: 0,
				isPlay: true,
				dotWidth: 12,
				offset: 80,
				lineNum: 0
			}
		},
		components: {
			scroll
		},

		computed: {
			...mapGetters(['audio', 'isShowPlayer', 'isShowMiniPlayer']),

			playIcon() {
				return this.isPlay ? "icon-iconset0482" : "icon-bofang"
			},
			broadcastPace() {
				var scale = (this.currentTime / this.songTime)
				if(document.querySelector(".bar_len")) {
					var bar_len = document.querySelector(".bar_len").offsetWidth
					//					console.log(bar_len)
				}

				return scale * bar_len
			},
			songLrc() {
				if(this.audio.lrc) {
					var temp = [];
					var lyrics = this.audio.lrc.split("\n");
					for(var i = 0; i < lyrics.length; i++) {
						var lyric = decodeURIComponent(lyrics[i]);
						var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
						var timeRegExpArr = lyric.match(timeReg);
						if(!timeRegExpArr) continue;
						var lrcContent = lyric.replace(timeReg, '');
						for(var k = 0, h = timeRegExpArr.length; k < h; k++) {
							var t = timeRegExpArr[k];
							var min = Number(String(t.match(/\[\d*/i)).slice(1)),
								sec = Number(String(t.match(/\:\d*/i)).slice(1));
							var seconds = min * 60 + sec;
						}

						temp.push({
							seconds,
							lrcContent
						})

					}
					//					console.log(temp)

					return temp;
				}

			},

			lrcOffset() {
				if(this.songLrc) {
					var offset = (this.songLrc.length - document.querySelectorAll('.isCurrentLrc').length - 1) * (-20)
					return this.currentTime + offset - this.currentTime
				}
			}

		},
		filters: {
			time(value) {
				var length = Math.floor(parseInt(value));
				var minute = Math.floor(value / 60);
				if(minute < 10) {
					minute = '0' + minute;
				}
				var second = length % 60;
				if(second < 10) {
					second = '0' + second;
				}
				return minute + ':' + second
			}
		},

		methods: {
			lineHeight() {
				if(this.songLrc) {
					for(var i = 0; i < this.songLrc.length; i++) {
						/*当前播放的时间*/
						if(this.currentTime > this.songLrc[i].seconds) {
							if(i >= 1) {
								// lyric 二维数组 第一个span放当前歌词前一条，第二个span放当前显示歌词，第三个span放当前歌词后一条
								this.lineNum = i

							} else {}
						}
					}

				}

			},

			progressGo(e) {
				const rect = document.querySelector(".progress_bar").getBoundingClientRect()
				const offsetWidth = e.pageX - rect.left
				const dot = document.querySelector(".dot")
				const now = document.querySelector(".now")
				const progressBar = document.querySelector(".progress_bar")
				const oA = this.$refs.audio

				const percent = offsetWidth / progressBar.clientWidth

				console.log(percent)

				dot.style.left = `${offsetWidth}px`
				now.style.width = `${offsetWidth}px`
				oA.currentTime = oA.duration * percent
			},

			prev() {
				this.$store.dispatch('prev')
			},
			next() {
				this.$store.dispatch('next')
			},
			toggleStatus() {
				if(this.isPlay) {
					this.$refs.audio.pause()

				} else {
					this.$refs.audio.play()

				}
				this.isPlay = !this.isPlay

			},
			timeUpdate() {
				var oA = this.$refs.audio
				this.currentTime = oA.currentTime
				this.songTime = oA.duration
				this.lineHeight()
			},
			showNormalPlayer() {
				this.$store.commit("showMiniPlayer", false)
				this.$store.commit("showNormalPlayer", true)

			},
			showMiniPlayer() {
				this.$store.commit("showMiniPlayer", true)
				this.$store.commit("showNormalPlayer", false)
			},
			middleTouchStart(e) {
				this.startX = e.changedTouches[0].pageX;
				e.preventDefault();
			},
			middleTouchMove(e) {
				this.endX = e.touches[0].clientX;
				e.preventDefault();
			},
			middleTouchEnd() {
				var offsetX = this.endX - this.startX;

				if(offsetX < -this.offset) {
					this.$refs.left.style.opacity = 0
					this.$refs.left.style.transition = ".5s"

					this.$refs.right.style.transform = "translateX(0)"
					this.$refs.right.style.transition = ".5s"
					this.currentShow = 'lyric'

				} else if(offsetX > this.offset) {
					this.$refs.left.style.opacity = 1
					this.$refs.left.style.transition = ".5s"

					this.$refs.right.style.transform = "translateX(100%)"
					this.$refs.right.style.transition = ".5s"
					this.currentShow = 'cd'

				}
			}
		},
		watch: {
			//观察行数变化滚动歌词
			lineNum(i) {
				if(i > 5) {
					let lineEl = this.$refs.lyricLine[i - 5]
					this.$refs.lyricList.scrollToElement(lineEl, 1000)
				} else {
					this.$refs.lyricList.scrollTo(0, 0, 1000)
				}
			}
		}

	}
</script>

<style scoped="scoped">
	@keyframes rotate {
		from {
			transform: rotate(0);
		}
		to {
			transform: rotate(360deg);
		}
	}
	
	.cd-play {
		animation: rotate 20s linear infinite
	}
	
	.cd-pause {
		animation-play-state: paused;
	}
	
	.detail_player {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: -1;
		background-position: center;
		background-size: cover;
		background-repeat: no-repeat;
		filter: blur(20px);
		opacity: 0.6;
	}
	
	.normal-player {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 150;
		background: #222;
	}
	
	.normal-player .top {
		height: 60px;
		width: 100%;
		position: relative;
	}
	
	.normal-player .top h1 {
		width: 70%;
		margin: 0 auto;
		line-height: 40px;
		text-align: center;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		font-size: 18px;
		color: #fff;
		font-weight: normal;
	}
	
	.normal-player .top h2 {
		line-height: 1.5;
		text-align: center;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		font-size: 14px;
		color: #fff;
		font-weight: normal;
	}
	
	.normal-player .top .back {
		position: absolute;
		top: 0;
		left: 6px;
		z-index: 50;
	}
	
	.normal-player .top .back i {
		display: block;
		padding: 8px;
		font-size: 22px;
		color: #ffcd32;
		transform: rotate(-90deg);
	}
	
	.normal-player .middle {
		position: fixed;
		width: 100%;
		top: 80px;
		bottom: 170px;
		white-space: nowrap;
	}
	
	.normal-player .middle .left {
		position: absolute;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 1;
	}
	
	.normal-player .middle .right {
		width: 100%;
		height: 100%;
		transform: translateX(100%);
		overflow: hidden;
	}
	
	.normal-player .middle .right .big-lrc {
		width: 100%;
		height: 100%;
		overflow: hidden;
		text-align: center;
	}
	
	.normal-player .middle .right .big-lrc .lrc-content p {
		text-align: center;
		line-height: 32px;
		color: hsla(0, 0%, 100%, .5);
		font-size: 14px;
	}
	
	.normal-player .middle .cd-wrapper {
		position: absolute;
		width: 80%;
		left: 10%;
		top: 0;
		height: 100%;
	}
	
	.normal-player .middle .cd {
		text-align: center;
		
		margin: 0 auto;
	}
	
	.normal-player .middle .cd img {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		box-sizing: border-box;
		border: 10px solid hsla(0, 0%, 100%, .1);
	}
	
	.normal-player .mini-lrc {
		width: 100%;
		padding: 0 20px;
		overflow: hidden;
		text-align: center;
		position: absolute;
		bottom: 0px;
		height: 20px;
	}
	
	.normal-player .mini-lrc .lrc-content {
		transition: all .5s;
	}
	
	.normal-player .mini-lrc .lrc-content p {
		color: hsla(0, 0%, 100%, .5);
		height: 20px;
		line-height: 20px;
		font-size: 14px;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	
	.normal-player .bottom {
		position: absolute;
		bottom: 40px;
		width: 100%;
	}
	
	.normal-player .bottom .dot-wrapper {
		width: 100%;
		font-size: 0;
		text-align: center;
	}
	
	.normal-player .bottom .dot-wrapper .dot {
		display: inline-block;
		height: 8px;
		width: 8px;
		margin: 0 4px;
		border-radius: 4px;
		background: hsla(0, 0%, 100%, .8);
	}
	
	.normal-player .bottom .dot-wrapper .dot.active {
		width: 20px;
	}
	
	.controls {
		display: flex;
		align-items: center;
	}
	
	.controls div {
		flex: 1;
		text-align: center;
	}
	
	.controls div .iconfont {
		font-size: 50px;
		color: #ffcd32;
		display: block;
	}
	
	.controls div.prev {
		text-align: right;
	}
	
	.controls div.next {
		text-align: left;
	}
	
	.progress {
		width: 90%;
		margin: 0 auto;
		color: #fff;
		display: flex;
		align-items: center;
		padding: 10px 0;
	}
	
	.progress span {
		padding: 5px;
		font-size: 12px;
	}
	
	.progress .progress_bar_warpper {
		flex: 1;
	}
	
	.progress_bar_warpper .progress_bar {
		height: 20px;
		position: relative;
	}
	
	.progress_bar_warpper .progress_bar .bar_len {
		width: 100%;
		height: 3px;
		background: rgba(0, 0, 0, .3);
		position: absolute;
		top: 8px;
	}
	
	.progress_bar_warpper .progress_bar .bar_len .now {
		height: 3px;
		background: #ffcd32;
		width: 0;
	}
	
	.progress_bar_warpper .progress_bar .bar_len .dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: #EEEEEE;
		position: absolute;
		top: -4px;
		left: 0;
	}
	
	.mini-player {
		display: flex;
		-ms-flex-align: center;
		align-items: center;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 180;
		width: 100%;
		height: 60px;
		background: #333;
	}
	
	.mini-player .icon {
		width: 20%;
		width: 45px;
		height: 45px;
		background-size: contain;
		margin: 0 10px 0 15px;
		border-radius: 50%;
		border: 1px solid #666666;
	}
	
	.mini-player .text {
		width: 50%;
	}
	
	.mini-player .text h3 {
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		color: #fff;
		font-weight: normal;
		font-size: 14px;
		padding: 4px 0;
	}
	
	.mini-player .text p {
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		font-size: 12px;
		color: hsla(0, 0%, 100%, .3);
	}
	
	.mini-player .control {
		width: 30%;
		display: flex;
	}
	
	.mini-player .control i {
		display: block;
		width: 100%;
		height: 100%;
		font-size: 40px;
		line-height: 40px;
		color: rgba(255, 205, 49, .5);
		margin-left: 8px;
	}
	
	.mini-animate-enter-active,
	.mini-animate-leave-active {
		transition: all 0.5s
	}
	
	.mini-animate-enter,
	.mini-animate-leave-to {
		transform: translate3d(0, 100%, 0);
		opacity: 0;
	}
	
	.normal-animate-enter-active,
	.normal-animate-leave-active {
		transition: all 0.5s
	}
	
	.normal-animate-enter,
	.normal-animate-leave-to {
		transform: scaleY(0);
		opacity: 0;
	}
	
	.current {
		color: #fff !important;
	}
</style>