import Vue from 'vue'
import Router from 'vue-router'

import Rank from '../views/Rank'
import RankInfo from '../views/rankInfo'
import SingerInfo from '../views/singerInfo'
import pList from '../views/pList'
import Search from '../views/Search'
import Singer from '../views/singer'
import Playlist from '../views/pListInfo'

Vue.use(Router)

export default new Router({
	linkActiveClass: 'active',

	routes: [
		{
			path: '*',
			redirect: {
				name: 'recommend'
			},
			meta: {
				keepAlive: true
			}
		},
		{
			name: 'recommend',
			path: '/recommend',
			component: pList,
			meta: {
				keepAlive: true
			}
		},
		{
			path: '/Rank',
			component: Rank,
			name: 'rank',
			meta: {
				keepAlive: true
			}
		},
		{
			path: '/Search',
			name: 'search',
			component: Search,
			meta: {
				keepAlive: true
			}
		},
		{
			path: '/Singer',
			name: 'singer',
			component: Singer,
			meta: {
				keepAlive: true
			}
		},
		{
			path: '/recommend/:id',
			component: Playlist
		},
		{
			path: '/rank/info/:id',
			component: RankInfo
		},
		{
			path: '/singer/info/:id',
			component: SingerInfo
		}
	]
})