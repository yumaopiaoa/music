<template>
	<div class="loading_box">
		<div class="loading">
			<img src="../assets/loading.gif" />
			<p>正在加载...</p>
		</div>
	</div>
</template>

<script>
</script>

<style scoped="scoped">
	.loading_box {
		position: absolute;
		width: 100%;
		top: 50%;
		transform: translateY(-50%);
	}
	
	.loading {
		vertical-align: middle;
		text-align: center;
	}
	
	.loading img {
		text-align: center;
		width: 30px;
		height: 30px;
	}
	
	.loading p {
		color: #fff;
		text-align: center;
	}
</style>