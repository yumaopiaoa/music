<template>
	<div class="rank" :style="{bottom:`${offsetBottom}px`}">
		<loading v-show='songList.length==0'></loading>
		<scroll :data="songList" class="rank_list">
			<ul class="rank_container">
				<li v-for="(item,index) in songList" @click="selectItem(item)">
					<div class="rank_img_container">
						<img v-lazy="item.imgurl.replace('{size}', '400')" />

					</div>

					<div class="rank_name_container">
						{{item.rankname}}

					</div>

				</li>
			</ul>

		</scroll>

	</div>
</template>

<script>
	import { mapGetters } from 'vuex'
	import scroll from '../components/scroll'
	import loading from '../components/loading'

	export default {
		components: {
			scroll,
			loading
		},
		data() {
			return {
				songList: []
			}
		},
		created(){
			this.getList()
		},
		computed:{
			...mapGetters(['offsetBottom'])
			
		},
		methods: {
			selectItem(item) {
				this.$router.push({
					path: `/rank/info/${item.rankid}`
				})
			},
			getList(){
				this.$http.get('/proxy/rank/list&json=true').then(({data}) => {
					this.songList = data.rank.list
				});
			}
		}
	}
</script>

<style scoped="scoped">
	.rank {
		position: fixed;
		width: 100%;
		top: 90px;
		bottom: 0;
	}
	
	.rank .mint-cell-title img {
		margin-right: 10px;
	}
	
	.rank .mint-cell-wrapper {
		font-size: 16px;
	}
	
	.rank_list {
		height: 100%;
		overflow: hidden;
	}
	
	.rank_container {
		padding: 20px 30px;
	}
	
	.rank_container li {
		width: 100%;
		background: #333;
		height: 80px;
		color: hsla(0, 0%, 100%, .3);
		border-radius: 5px;
		margin-bottom: 20px;
		display: flex;
	}
	
	.rank_container li .rank_img_container {
		width: 80px;
		height: 100%;
		flex: 0 0 80px;
	}
	
	.rank_container li .rank_img_container img {
		width: 100%;
		height: 100%;
	}
	
	.rank_container li .rank_name_container {
		line-height: 80px;
		flex: 1;
		padding-left: 20px;
	}
</style>