import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../components/layout/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('../views/Dashboard.vue')
        },
        {
          path: 'map',
          name: 'map',
          component: () => import('../views/MapView.vue')
        },
        {
          path: 'production',
          name: 'production',
          component: () => import('../views/ProductionView.vue')
        },
        {
          path: 'market',
          name: 'market',
          component: () => import('../views/MarketView.vue')
        },
        {
          path: 'population',
          name: 'population',
          component: () => import('../views/PopulationView.vue')
        },
        {
          path: 'technology',
          name: 'technology',
          component: () => import('../views/TechnologyView.vue')
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('../views/SettingsView.vue')
        }
      ]
    }
  ]
})

export default router
