<template>
	<div class="header-nav">
		<ul>
			<router-link class="tab-item" :to="{name:'recommend'}">
				推荐
			</router-link>
			<router-link class="tab-item" :to="{name:'singer'}">
				歌手
			</router-link>
			<router-link class="tab-item" :to="{name:'rank'}">
				排行榜
			</router-link>
			<router-link class="tab-item" :to="{name:'search'}">
				搜索
			</router-link>
		</ul>
	</div>
</template>

<script>
	export default{
		
	}
</script>

<style scoped="scoped">
	.header-nav {
		height: 44px;
	}
	
	.header-nav ul {
		display: flex;
	}
	
	.header-nav ul .tab-item {
		flex: 1;
		color: hsla(0, 0%, 100%, .5);
		text-align: center;
		line-height: 44px;
	}
	
	.header-nav ul .tab-item.active {
		text-decoration: none;
		color: #FFCD32;
		border-bottom: 2px solid #FFCD32;
	}
</style>