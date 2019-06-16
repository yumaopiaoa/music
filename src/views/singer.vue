<template>

	<div class="singer" :style="{bottom:`${offsetBottom}px`}">
		<loading v-show='singers.length==0'></loading>
		<scroll ref='scroll' :data="singers" class="singer_wrap">

			<div class="singers">
				<div class="singer_list" v-for="singers in singers" @click="goRouter(singers.singerid)">

					<img class="headshot" v-lazy="singers.imgurl.replace('{size}', '400')" />
					<div class="name">{{singers.singername}}</div>
				</div>

			</div>
		</scroll>
	</div>
</template>

<script>
	import scroll from '../components/scroll'
	import loading from '../components/loading'
	import { mapGetters } from 'vuex'
	
	export default {
		data() {
			return {
				singers: []
			}
		},
		components: {
			scroll,
			loading
		},
		computed:{
			...mapGetters(['offsetBottom'])
			
		},
		update(){
			this.$refs.scroll.refresh()
		},
		mounted() {
			this.getSinger()
		},

		methods: {
			goRouter(id){
//				console.log(id)
				this.$router.push({path: `/singer/info/${id}`})
			},
			getSinger() {
				this.$http.get('/proxy/singer/list/88&json=true').then(({
					data
				}) => {
//					console.log(data)
					const singers = data.singers.list.info
					this.singers = singers
				});
			}

		}
	}
</script>

<style scoped="scoped">
	.singer {
		position: fixed;
		width: 100%;
		top: 90px;
		bottom: 0;
	}
	.singer_wrap{
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	.singer .singers {
		padding: 20px 0px;
	}
	
	.singer .singers .singer_list {
		width: 100%;
		display: flex;
		color: hsla(0, 0%, 100%, .5);
		padding: 15px 30px;
	}
	
	.singer .singers .singer_list .headshot {
		width: 60px;
		height: 60px;
		border-radius: 30px;
		margin-right: 20px;
	}
	
	.singer .singers .singer_list .name {
		flex: 1;
		line-height: 4;
	}
</style>