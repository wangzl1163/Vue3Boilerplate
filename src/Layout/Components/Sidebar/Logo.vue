<template>
	<div class="sidebar-logo-container" :class="{ collapse: collapse }">
		<transition name="sidebarLogoFade">
			<router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
				<img v-if="logo" :src="logo" class="sidebar-logo" />
				<h1 v-else class="sidebar-title">{{ title }}</h1>
			</router-link>
			<router-link v-else key="expand" class="sidebar-logo-link" to="/">
				<img v-if="logo" :src="logo" class="sidebar-logo" />
				<h1 class="sidebar-title">{{ title }}</h1>
			</router-link>
		</transition>
	</div>
</template>

<script>
import logoImg from '@/Assets/Images/Logo.png'
import settings from '@/Settings'

export default {
	name: 'SidebarLogo',
	props: {
		collapse: {
			type: Boolean,
			required: true
		}
	},
	data() {
		return {
			title: settings.title,
			logo: logoImg
		}
	}
}
</script>

<style lang="less" scoped>
.sidebarLogoFade-enter-active {
	transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
	opacity: 0;
}

.sidebar-logo-container {
	position: relative;
	width: 100%;
	height: 78px;
	line-height: 56px;
	background-image: url(../../../Assets/Images/BgImg.png);
	background-repeat: no-repeat;
	background-position: top left;
	text-align: center;
	overflow: hidden;

	& .sidebar-logo-link {
		height: 100%;
		width: 100%;

		& .sidebar-logo {
			width: 32px;
			height: 32px;
			vertical-align: middle;
			margin-right: 12px;
		}

		& .sidebar-title {
			display: inline-block;
			margin: 0;
			color: #fff;
			font-weight: 600;
			line-height: 50px;
			font-size: 14px;
			font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
			vertical-align: middle;
		}
	}

	&.collapse {
		.sidebar-logo {
			margin-right: 0px;
		}
	}
}
</style>
