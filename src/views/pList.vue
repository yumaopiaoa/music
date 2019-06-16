<template>
	<div id="p-list" :style="{bottom:`${offsetBottom}px`}">
		<scroll ref='scroll' class="scroll-content" :data="list">
			<div>
				<div class="swiper-container">
					<div class="swiper-wrapper">
						<div class="swiper-slide" v-for="(banner, index) in banners" :key="index">
							<img :src="banner.imgurl" alt="">
						</div>
					</div>
				</div>

				<div class="plist-hot">

					<h2>热门歌单推荐</h2>

					<ul class="from_bottom">
						<loading v-show='list.length==0'></loading>

						<li @click="selectItem(item)" class="item" v-for="(item,index) in list">
							<div class="icon"><img v-lazy="item.imgurl.replace('{size}', '400')"></div>
							<div class="text">
								<h2 class="name">{{item.specialname}}</h2>
								<p class="desc">{{item.intro}}</p>
								<p class="type"> ♬ {{item.playcount}}</p>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</scroll>

	</div>
</template>

<script>
	import Swiper from 'swiper'
	import scroll from '../components/scroll'
	import loading from '../components/loading'
	import { mapGetters } from 'vuex'

	export default {
		data() {
			return {
				banners: [],
				list: []

			}
		},
		computed: {
			...mapGetters(['offsetBottom'])

		},
		components: {
			scroll,
			loading
		},
		mounted() {
			this.getSongs()
			this.getList()

			this.$nextTick(() => {
				this.initSwiper()
			});　　
		},

		methods: {
			selectItem(item) {
				this.$router.push({
					path: `/recommend/${item.specialid}`
				});
			},
			getSongs() {
				
				this.$http.get('/proxy/?json=true').then(({
					data
				}) => {
					this.banners = data.banner
				})
			},
			getList() {
				this.$http.get('/proxy/plist/index&json=true').then(({
					data
				}) => {
					this.list = data.plist.list.info
				})
			},
			initSwiper() {
				this.swiper = new Swiper('.swiper-container', {
					speed: 500,
					loop: false,
					autoplay: {
						disableOnInteraction: false,
						delay: 3000,
					},
					observer: true, //修改swiper自己或子元素时，自动初始化swiper
					observeParents: true //修改swiper的父元素时，自动初始化swiper

				})
			}

		}
	}
</script>

<style scoped="scoped">
	#p-list {
		position: fixed;
		top: 90px;
		width: 100%;
		bottom: 0;
	}
	
	.scroll-content {
		height: 100%;
		overflow: hidden;
		position: relative;
	}
	
	#p-list .p-list-scroll {
		height: 100%;
		overflow: hidden;
	}
	
	#p-list .swiper-container {
		height: 39vw !important;
	}
	
	#p-list .swiper-container .swiper-wrapper {
		width: 100%;
	}
	
	.from_bottom {}
	
	h2 {
		width: 100%;
		height: 50px;
		font-size: 16px;
		font-weight: normal;
		color: #FFCD32;
		text-align: center;
		line-height: 50px;
	}
	
	.item {
		padding: 0 20px 20px;
		display: flex;
	}
	
	.icon {
		flex: 0 0 60px;
		width: 60px;
		margin-right: 20px;
	}
	
	.icon img {
		width: 60px;
		height: 60px;
	}
	
	.name {
		text-align: left;
		font-size: 14px;
		height: 30px;
		line-height: 30px;
		color: #FFFFFF;
		font-weight: normal;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	
	.text {
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	
	.type {
		color: hsla(0, 0%, 100%, .3);
		overflow: hidden;
		font-size: 12px;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	
	.desc {
		margin-bottom: 5px;
		font-size: 12px;
		color: hsla(0, 0%, 100%, .3);
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>